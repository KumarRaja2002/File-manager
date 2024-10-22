import { Context } from 'hono';
import { fileService } from '../services/database/fileDataServiceProvider';
import { ResponseHelper } from '../helpers/responseHelper';
import PaginationHelper from '../helpers/paginationHelper';
import { filterHelper } from '../helpers/filterHelper';
import { sortHelper } from '../helpers/sortHelper';
import { s3FileService } from '../services/s3Service/s3DataServiceProvider';
import { fileNameHelper } from "../helpers/filenameHelper";
import { AUTHENTICATION_FAILED, CATEGORY_NOT_FOUND, ERROR_FETCHING_FILES, FETCHED_INCOMPLETE_PARTS, FILE_DELETED, FILE_FETCHED, FILE_NOT_FOUND, FILE_RESTORED, FILE_UPLOADED, FILES_ARCHIVED, FILES_DELETED, FILES_FETCHED, MULTIPART_UPLOAD_ABORTED, MULTIPART_UPLOAD_START, MULTIPART_UPLOAD_SUCCESS, MULTIPART_UPLOAD_URLS, PRESIGNED_URL_GENERATED, STATUS_UPDATED_TO_ARCHIVE, STORAGE_FETCHED } from "../constants/appMessages";
import validate from "../helpers/validationHelper";
import { UploadeFileDataInput, uploadFileData } from "../validations/s3Validations/uploadFileData";
import { getUrlsData, GetURLsDataInput } from "../validations/s3Validations/getUrlsData";
import { completeUploadData, CompleteUploadDataInput } from "../validations/s3Validations/completeUploadData";
import { abortUploadData, AbortUploadData } from "../validations/s3Validations/abortUpload";
import { ForbiddenException } from '../exceptions/forbiddenException';
import { CategoryService } from '../services/database/categoryDataServiceProvider';
import { GeneratePresignedUrlDataInput, generatePresignedUrlData } from "../validations/s3Validations/generatePresignedUrlData";
import { singleFileData } from '../validations/fileValidaions/uploadFileData';
import paginationHelper from '../helpers/paginationHelper';
import { NotFoundException } from '../exceptions/notFounException';
import { NO_FILES_FOUND } from '../constants/appMessages';
import { mapFileResponse } from '../helpers/fileResponseHelper';
import { updateFileData } from '../validations/fileValidaions/updateFileData';


const S3FileService = new s3FileService();
const categoryService = new CategoryService();


class FileController {

    public async generatePresignedUrl(c: Context) {
        try {
            const reqData = await c.req.json();

            const validatedData: GeneratePresignedUrlDataInput = await validate(generatePresignedUrlData, reqData);

            const { fileName, fileType, fileSize } = validatedData;

            const categoryId = parseInt(c.req.param('id'));

            const category = await categoryService.findCategoryById(categoryId);

            if (!category) {
                throw new NotFoundException(CATEGORY_NOT_FOUND);
            }

            const categorySlug = category.slug;

            const timestamp = Date.now();
            const updatedFileName = `${timestamp}_${fileName}`;

            const { presignedUrl, path } = await S3FileService.generatePresignedUrl(updatedFileName, fileType, fileSize, categorySlug);

            return ResponseHelper.sendSuccessResponse(c, 200, PRESIGNED_URL_GENERATED, {
                generate_url: presignedUrl,
                file_name: updatedFileName,
                file_size: fileSize,
                file_type: fileType,
                path
            });
        } catch (error: any) {
            throw error;
        }
    }

    public async addFile(c: Context) {
        try {
            const categoryId = parseInt(c.req.param("id"));
            const fileData = await c.req.json();
            const user = c.get("user");

            if (!user) {
                throw new ForbiddenException(AUTHENTICATION_FAILED);
            }

            const validatedData = await validate(singleFileData, fileData);

            const mappedFileData = {
                ...validatedData,
                category_id: categoryId,
                uploaded_by: user.id,
            };

            const titleExists = await fileService.checkTitleExists(mappedFileData.title, categoryId);
            if (titleExists) {
                return ResponseHelper.sendErrorResponse(c, 409, `A file with the title '${mappedFileData.title}' already exists in this category.`);
            }

            const result = await fileService.createFile(mappedFileData);
            return ResponseHelper.sendSuccessResponse(c, 200, FILE_UPLOADED, result);

        } catch (error: any) {
            throw error;
        }
    }


    public async getFiles(c: Context) {
        try {
            const query = c.req.query();
            const categoryId = parseInt(c.req.param('id'), 10);

            const page: number = parseInt(query.page || '1', 10);
            const limit: number = parseInt(query.limit || '10', 10);
            const skip: number = (page - 1) * limit;

            const filters = filterHelper.newFilesFilter(query, categoryId);
            console.log('filters', filters);
            const sort = sortHelper.dynamicSort(query.sort_by, query.sort_type);

            const [files, totalCount] = await Promise.all([
                fileService.findAll({ offset: skip, limit, filters, sort }),
                fileService.getCount(filters),
            ]);

            const updatedFiles: any = await Promise.all(
                files.map(async (file) => await mapFileResponse(file))
            );

            const result = await PaginationHelper.getPaginationResponse({
                page,
                count: totalCount,
                limit,
                skip,
                data: updatedFiles,
                message: FILES_FETCHED,
                searchString: query.search_string || ''
            });
            return c.json(result);
        } catch (error: any) {
            console.error(ERROR_FETCHING_FILES, error);
            throw error;
        }
    }

    public async getOne(c: Context) {
        try {
            const categoryId = +c.req.param('category_id');
            const fileId = +c.req.param('file_id');

            const fileData = await fileService.findFileById(categoryId, fileId);

            if (!fileData) {
                throw new NotFoundException(FILE_NOT_FOUND);
            }

            const presignedUrl = await S3FileService.generateDownloadFilePresignedURL(fileData.path);

            const updatedFileData = { ...fileData, downloadUrl: presignedUrl };

            return ResponseHelper.sendSuccessResponse(c, 200, FILE_FETCHED, updatedFileData);
        } catch (error: any) {
            throw error;
        }
    }

    // public async updateSingleFile(c: Context) {
    //     try {
    //         const categoryId = +c.req.param('category_id');
    //         const fileId = +c.req.param('file_id');
    //         const fileData = await fileService.findFileById(categoryId, fileId);
    //         if (!fileData) {
    //             throw new NotFoundException(FILE_NOT_FOUND);
    //         }
    //         const reqData = await c.req.json();
    //         const updatedData = { title: reqData.title };
    //         const updatedFileData = await fileService.updateFileById(categoryId, fileId, updatedData);
    //         return ResponseHelper.sendSuccessResponse(c, 200, "File Updated Successfully", updatedFileData);
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    public async updateSingleFile(c: Context) {
        try {
            const categoryId = +c.req.param('category_id');
            const fileId = +c.req.param('file_id');
            const fileData = await fileService.findFileById(categoryId, fileId);

            if (!fileData) {
                throw new NotFoundException(FILE_NOT_FOUND);
            }

            const reqData = await c.req.json();

            const validData = validate(updateFileData, reqData);
            if (!validData) {
                return ResponseHelper.sendErrorResponse(c, 422, "Title is Required");
            }

            const updatedFileData = await fileService.updateFileById(categoryId, fileId, validData);

            return ResponseHelper.sendSuccessResponse(c, 200, "File Updated", updatedFileData);

        } catch (error) {
            throw error;
        }
    }


    public async deleteById(c: Context) {
        try {
            const categoryId = +c.req.param('category_id');
            const fileId = +c.req.param('file_id');

            const fileData = await fileService.deleteFileById(categoryId, fileId);

            if (!fileData) {
                throw new NotFoundException(FILE_NOT_FOUND);
            }

            return ResponseHelper.sendSuccessResponse(c, 200, STATUS_UPDATED_TO_ARCHIVE, fileData);

        } catch (error: any) {
            throw error;
        }
    }


    // deleteing ireespective of category
    public async deleteNewFileById(c: Context) {
        try {
            const fileId = +c.req.param('file_id');

            const fileData = await fileService.deleteNewFileById(fileId);

            if (!fileData) {
                throw new NotFoundException(FILE_NOT_FOUND);
            }

            return ResponseHelper.sendSuccessResponse(c, 200, FILE_DELETED, fileData);

        } catch (error: any) {
            throw error;
        }
    }


    public async generateDownloadPresignedUrl(c: Context) {
        try {
            const { fileId } = await c.req.json();
            const fileIdNumber = Number(fileId);

            if (isNaN(fileIdNumber)) {
                return c.json({ error: 'Invalid file ID' }, 400);
            }

            const file = await fileService.findSingleFile(fileIdNumber);

            if (!file) {
                throw new NotFoundException(FILE_NOT_FOUND);
            }

            const filePath = file.path;
            const downloadPresignedUrl = await S3FileService.generateDownloadFilePresignedURL(filePath);

            return c.json({
                url: downloadPresignedUrl,
                path: filePath,
            });
        } catch (error: any) {
            throw error;
        }
    }


    public async initializeMultipartUpload(c: Context) {
        try {
            const reqData = await c.req.json();
            const category_id = parseInt(c.req.param('id'));
            const validatedData: UploadeFileDataInput = await validate(uploadFileData, reqData);

            const category = await categoryService.findCategoryById(category_id);

            if (!category) {
                return ResponseHelper.sendErrorResponse(c, 404, CATEGORY_NOT_FOUND);
            }

            const slug = category.slug;

            const fileName = await fileNameHelper(validatedData);
            const uploadedData = await S3FileService.initializeMultipartUpload(slug, fileName);

            const response = {
                file_type: reqData.file_type,
                original_name: reqData.original_name,
                upload_id: uploadedData.UploadId,
                key: fileName,
                file_key: `${slug}/` + fileName,
            };

            return ResponseHelper.sendSuccessResponse(c, 200, MULTIPART_UPLOAD_START, response);
        } catch (error: any) {
            throw error;
        }
    }


    public async getMultipartUploadUrls(c: Context) {
        try {
            const reqData = await c.req.json();
            const validatedData: GetURLsDataInput = await validate(getUrlsData, reqData);

            const uploadUrls = await S3FileService.multipartPresignedUrl(
                validatedData.file_key,
                validatedData.parts,
                validatedData.upload_id
            );

            return ResponseHelper.sendSuccessResponse(c, 200, MULTIPART_UPLOAD_URLS, uploadUrls);
        } catch (error: any) {
            throw error;
        }
    }

    public async completeMultipartUpload(c: Context) {
        try {
            const reqData = await c.req.json();

            const validatedData: CompleteUploadDataInput = await validate(completeUploadData, reqData);

            await S3FileService.completeMultipartUpload(validatedData.file_key, validatedData.upload_id, validatedData.parts);

            return ResponseHelper.sendSuccessResponse(c, 200, MULTIPART_UPLOAD_SUCCESS);

        } catch (error: any) {
            throw error;
        }
    }

    public async abortMultipartUpload(c: Context) {
        try {
            const reqData = await c.req.json();

            const validatedData: AbortUploadData = await validate(abortUploadData, reqData);

            await S3FileService.abortMultipartUpload(validatedData.file_key, validatedData.upload_id);

            return ResponseHelper.sendSuccessResponse(c, 200, MULTIPART_UPLOAD_ABORTED);

        } catch (error: any) {
            throw error;
        }
    }

    public async listIncompleteParts(c: Context) {
        try {
            const reqData = await c.req.json();

            const validatedData = await validate(getUrlsData, reqData);

            const incompleteUploads = await S3FileService.listIncompleteParts(validatedData.file_key, validatedData.upload_id, validatedData.parts);

            return ResponseHelper.sendSuccessResponse(c, 200, FETCHED_INCOMPLETE_PARTS, incompleteUploads);

        } catch (error: any) {
            throw error;
        }
    }

    public async getUserStorage(c: Context) {
        try {
            const user = c.get('user');
            if (!user) {
                throw new ForbiddenException(AUTHENTICATION_FAILED);
            }

            const query = c.req.query();

            const filters = filterHelper.getFileTypeFilter(query, 'all', user.id);

            const totalStorage = await fileService.getTotalStorage(filters);

            const totalFileCount = await fileService.getTotalFileCount(filters);

            const breakdownFilters = filterHelper.getBreakdownFilters(user.id);

            const breakdownResult = await fileService.getStorageBreakdown(breakdownFilters);

            const storageBreakdown = {
                image: { storage: 0, count: 0 },
                media: { storage: 0, count: 0 },
                document: { storage: 0, count: 0 },
                other: { storage: 0, count: 0 },
            };

            breakdownResult.forEach((row: { fileType: string, storage: number, count: number }) => {
                const fileType = row.fileType as keyof typeof storageBreakdown;
                if (fileType in storageBreakdown) {
                    storageBreakdown[fileType].storage = row.storage;
                    storageBreakdown[fileType].count = row.count;
                }
            });

            return ResponseHelper.sendSuccessResponse(c, 200, STORAGE_FETCHED, {
                user_id: user.id,
                totalStorage,
                totalStorageInMB: (totalStorage / (1024 * 1024)).toFixed(2),
                totalFileCount,
                storageBreakdown,
            });
        } catch (error: any) {
            throw error;
        }
    }


    public async deleteMultipleFiles(c: Context) {
        try {
            const category_id = +c.req.param('category_id');
            const { ids: file_ids } = await c.req.json()

            const fileData = await fileService.deleteFilesByIds(category_id, file_ids);

            if (fileData.length === 0) {
                throw new NotFoundException(NO_FILES_FOUND);
            }

            return ResponseHelper.sendSuccessResponse(c, 200, FILES_ARCHIVED, fileData);

        } catch (error) {
            throw error
        }
    }

    public async getAllFiles(c: Context) {
        try {

            const query = c.req.query();
            const user = c.get('user');
            const page = parseInt(query.page || '1', 10);
            const limit = parseInt(query.limit || '10', 10);
            const skip = (page - 1) * limit;

            query.uploaded_by = user.id;

            const filters = filterHelper.filesFilter(query);

            const sort = sortHelper.userWiseSort(query);
            const [files, totalCount]: any = await Promise.all([
                fileService.findAllUserwise({ offset: skip, limit, filters, sort }),
                fileService.getCount(filters),
            ]);

            const updatedFiles: any = await Promise.all(
                files.map(async (file: { path: any; }) => {
                    const slug = file.path;
                    const presignedUrl = await S3FileService.generateDownloadFilePresignedURL(slug);
                    return { ...file, url: presignedUrl };
                })
            );

            const paginationData = paginationHelper.getPaginationResponse({
                page,
                count: totalCount,
                limit,
                skip,
                data: updatedFiles,
                message: FILES_FETCHED,
                searchString: query.search_string
            });

            return c.json(paginationData);
        } catch (error) {
            throw error;
        }
    }

    // trash bin apis
    public async getArchivedFiles(c: Context) {
        try {
            const query = c.req.query();
            const user = c.get('user');
            const page = parseInt(query.page || '1', 10);
            const limit = parseInt(query.limit || '10', 10);
            const skip = (page - 1) * limit;
            query.uploaded_by = user.id;
            const filters = filterHelper.archivedFilesFilter(query);

            const sort = sortHelper.dynamicSort(query.sort_by, query.sort_type);

            const [files, totalCount]: any = await Promise.all([
                fileService.findAll({ offset: skip, limit, filters, sort }),
                fileService.getCount(filters),
            ]);

            const updatedFiles: any = await Promise.all(
                files.map(async (file: { path: any; }) => {
                    const slug = file.path;
                    const presignedUrl = await S3FileService.generateDownloadFilePresignedURL(slug);
                    return { ...file, url: presignedUrl };
                })
            );

            const paginationData = paginationHelper.getPaginationResponse({
                page,
                count: totalCount,
                limit,
                skip,
                data: updatedFiles,
                message: FILES_FETCHED,
                searchString: query.search_string
            });

            return c.json(paginationData);

        } catch (error) {
            throw error;
        }

    }

    public async deleteArchivedFiles(c: Context) {
        try {
            const user = c.get('user');

            if (!user || !user.id) {
                throw new ForbiddenException(AUTHENTICATION_FAILED);
            }

            const userId = user.id;

            const archivedFiles = await fileService.getArchivedFilesByUser(userId);

            if (archivedFiles.length === 0) {
                throw new NotFoundException(NO_FILES_FOUND);
            }

            const deletedFiles = await fileService.deleteArchivedFiles(archivedFiles);

            return ResponseHelper.sendSuccessResponse(c, 200, FILES_DELETED, deletedFiles);

        } catch (error) {
            throw error;
        }
    }

    public async updateArchivedFilesToActive(c: Context) {
        try {
            const user = c.get('user');

            if (!user || !user.id) {
                throw new ForbiddenException(AUTHENTICATION_FAILED);
            }

            const userId = user.id;

            const archivedFiles = await fileService.getArchivedFilesByUser(userId);

            if (archivedFiles.length === 0) {
                throw new NotFoundException(NO_FILES_FOUND);
            }

            const updatedFiles = await fileService.updateFilesStatusToActive(archivedFiles);

            return ResponseHelper.sendSuccessResponse(c, 200, FILE_RESTORED, updatedFiles);

        } catch (error) {
            throw error;
        }
    }




}

export const fileController = new FileController();



