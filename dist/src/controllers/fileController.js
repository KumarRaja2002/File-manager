"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileController = void 0;
const fileDataServiceProvider_1 = require("../services/database/fileDataServiceProvider");
const responseHelper_1 = require("../helpers/responseHelper");
const paginationHelper_1 = __importDefault(require("../helpers/paginationHelper"));
const filterHelper_1 = require("../helpers/filterHelper");
const sortHelper_1 = require("../helpers/sortHelper");
const s3DataServiceProvider_1 = require("../services/s3Service/s3DataServiceProvider");
const filenameHelper_1 = require("../helpers/filenameHelper");
const appMessages_1 = require("../constants/appMessages");
const validationHelper_1 = __importDefault(require("../helpers/validationHelper"));
const uploadFileData_1 = require("../validations/s3Validations/uploadFileData");
const getUrlsData_1 = require("../validations/s3Validations/getUrlsData");
const completeUploadData_1 = require("../validations/s3Validations/completeUploadData");
const abortUpload_1 = require("../validations/s3Validations/abortUpload");
const forbiddenException_1 = require("../exceptions/forbiddenException");
const categoryDataServiceProvider_1 = require("../services/database/categoryDataServiceProvider");
const generatePresignedUrlData_1 = require("../validations/s3Validations/generatePresignedUrlData");
const uploadFileData_2 = require("../validations/fileValidaions/uploadFileData");
const paginationHelper_2 = __importDefault(require("../helpers/paginationHelper"));
const notFounException_1 = require("../exceptions/notFounException");
const appMessages_2 = require("../constants/appMessages");
const fileResponseHelper_1 = require("../helpers/fileResponseHelper");
const updateFileData_1 = require("../validations/fileValidaions/updateFileData");
const S3FileService = new s3DataServiceProvider_1.s3FileService();
const categoryService = new categoryDataServiceProvider_1.CategoryService();
class FileController {
    async generatePresignedUrl(c) {
        try {
            const reqData = await c.req.json();
            const validatedData = await (0, validationHelper_1.default)(generatePresignedUrlData_1.generatePresignedUrlData, reqData);
            const { fileName, fileType, fileSize } = validatedData;
            const categoryId = parseInt(c.req.param('id'));
            const category = await categoryService.findCategoryById(categoryId);
            if (!category) {
                throw new notFounException_1.NotFoundException(appMessages_1.CATEGORY_NOT_FOUND);
            }
            const categorySlug = category.slug;
            const timestamp = Date.now();
            const updatedFileName = `${timestamp}_${fileName}`;
            const { presignedUrl, path } = await S3FileService.generatePresignedUrl(updatedFileName, fileType, fileSize, categorySlug);
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, appMessages_1.PRESIGNED_URL_GENERATED, {
                generate_url: presignedUrl,
                file_name: updatedFileName,
                file_size: fileSize,
                file_type: fileType,
                path
            });
        }
        catch (error) {
            throw error;
        }
    }
    async addFile(c) {
        try {
            const categoryId = parseInt(c.req.param("id"));
            const fileData = await c.req.json();
            const user = c.get("user");
            if (!user) {
                throw new forbiddenException_1.ForbiddenException(appMessages_1.AUTHENTICATION_FAILED);
            }
            const validatedData = await (0, validationHelper_1.default)(uploadFileData_2.singleFileData, fileData);
            const mappedFileData = {
                ...validatedData,
                category_id: categoryId,
                uploaded_by: user.id,
            };
            const titleExists = await fileDataServiceProvider_1.fileService.checkTitleExists(mappedFileData.title, categoryId);
            if (titleExists) {
                return responseHelper_1.ResponseHelper.sendErrorResponse(c, 409, `A file with the title '${mappedFileData.title}' already exists in this category.`);
            }
            const result = await fileDataServiceProvider_1.fileService.createFile(mappedFileData);
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, appMessages_1.FILE_UPLOADED, result);
        }
        catch (error) {
            throw error;
        }
    }
    async getFiles(c) {
        try {
            const query = c.req.query();
            const categoryId = parseInt(c.req.param('id'), 10);
            const page = parseInt(query.page || '1', 10);
            const limit = parseInt(query.limit || '10', 10);
            const skip = (page - 1) * limit;
            const filters = filterHelper_1.filterHelper.newFilesFilter(query, categoryId);
            console.log('filters', filters);
            const sort = sortHelper_1.sortHelper.dynamicSort(query.sort_by, query.sort_type);
            const [files, totalCount] = await Promise.all([
                fileDataServiceProvider_1.fileService.findAll({ offset: skip, limit, filters, sort }),
                fileDataServiceProvider_1.fileService.getCount(filters),
            ]);
            const updatedFiles = await Promise.all(files.map(async (file) => await (0, fileResponseHelper_1.mapFileResponse)(file)));
            const result = await paginationHelper_1.default.getPaginationResponse({
                page,
                count: totalCount,
                limit,
                skip,
                data: updatedFiles,
                message: appMessages_1.FILES_FETCHED,
                searchString: query.search_string || ''
            });
            return c.json(result);
        }
        catch (error) {
            console.error(appMessages_1.ERROR_FETCHING_FILES, error);
            throw error;
        }
    }
    async getOne(c) {
        try {
            const categoryId = +c.req.param('category_id');
            const fileId = +c.req.param('file_id');
            const fileData = await fileDataServiceProvider_1.fileService.findFileById(categoryId, fileId);
            if (!fileData) {
                throw new notFounException_1.NotFoundException(appMessages_1.FILE_NOT_FOUND);
            }
            const presignedUrl = await S3FileService.generateDownloadFilePresignedURL(fileData.path);
            const updatedFileData = { ...fileData, downloadUrl: presignedUrl };
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, appMessages_1.FILE_FETCHED, updatedFileData);
        }
        catch (error) {
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
    async updateSingleFile(c) {
        try {
            const categoryId = +c.req.param('category_id');
            const fileId = +c.req.param('file_id');
            const fileData = await fileDataServiceProvider_1.fileService.findFileById(categoryId, fileId);
            if (!fileData) {
                throw new notFounException_1.NotFoundException(appMessages_1.FILE_NOT_FOUND);
            }
            const reqData = await c.req.json();
            const validData = (0, validationHelper_1.default)(updateFileData_1.updateFileData, reqData);
            if (!validData) {
                return responseHelper_1.ResponseHelper.sendErrorResponse(c, 422, "Title is Required");
            }
            const updatedFileData = await fileDataServiceProvider_1.fileService.updateFileById(categoryId, fileId, validData);
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, "File Updated", updatedFileData);
        }
        catch (error) {
            throw error;
        }
    }
    async deleteById(c) {
        try {
            const categoryId = +c.req.param('category_id');
            const fileId = +c.req.param('file_id');
            const fileData = await fileDataServiceProvider_1.fileService.deleteFileById(categoryId, fileId);
            if (!fileData) {
                throw new notFounException_1.NotFoundException(appMessages_1.FILE_NOT_FOUND);
            }
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, appMessages_1.STATUS_UPDATED_TO_ARCHIVE, fileData);
        }
        catch (error) {
            throw error;
        }
    }
    // deleteing ireespective of category
    async deleteNewFileById(c) {
        try {
            const fileId = +c.req.param('file_id');
            const fileData = await fileDataServiceProvider_1.fileService.deleteNewFileById(fileId);
            if (!fileData) {
                throw new notFounException_1.NotFoundException(appMessages_1.FILE_NOT_FOUND);
            }
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, appMessages_1.FILE_DELETED, fileData);
        }
        catch (error) {
            throw error;
        }
    }
    async generateDownloadPresignedUrl(c) {
        try {
            const { fileId } = await c.req.json();
            const fileIdNumber = Number(fileId);
            if (isNaN(fileIdNumber)) {
                return c.json({ error: 'Invalid file ID' }, 400);
            }
            const file = await fileDataServiceProvider_1.fileService.findSingleFile(fileIdNumber);
            if (!file) {
                throw new notFounException_1.NotFoundException(appMessages_1.FILE_NOT_FOUND);
            }
            const filePath = file.path;
            const downloadPresignedUrl = await S3FileService.generateDownloadFilePresignedURL(filePath);
            return c.json({
                url: downloadPresignedUrl,
                path: filePath,
            });
        }
        catch (error) {
            throw error;
        }
    }
    async initializeMultipartUpload(c) {
        try {
            const reqData = await c.req.json();
            const category_id = parseInt(c.req.param('id'));
            const validatedData = await (0, validationHelper_1.default)(uploadFileData_1.uploadFileData, reqData);
            const category = await categoryService.findCategoryById(category_id);
            if (!category) {
                return responseHelper_1.ResponseHelper.sendErrorResponse(c, 404, appMessages_1.CATEGORY_NOT_FOUND);
            }
            const slug = category.slug;
            const fileName = await (0, filenameHelper_1.fileNameHelper)(validatedData);
            const uploadedData = await S3FileService.initializeMultipartUpload(slug, fileName);
            const response = {
                file_type: reqData.file_type,
                original_name: reqData.original_name,
                upload_id: uploadedData.UploadId,
                key: fileName,
                file_key: `${slug}/` + fileName,
            };
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, appMessages_1.MULTIPART_UPLOAD_START, response);
        }
        catch (error) {
            throw error;
        }
    }
    async getMultipartUploadUrls(c) {
        try {
            const reqData = await c.req.json();
            const validatedData = await (0, validationHelper_1.default)(getUrlsData_1.getUrlsData, reqData);
            const uploadUrls = await S3FileService.multipartPresignedUrl(validatedData.file_key, validatedData.parts, validatedData.upload_id);
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, appMessages_1.MULTIPART_UPLOAD_URLS, uploadUrls);
        }
        catch (error) {
            throw error;
        }
    }
    async completeMultipartUpload(c) {
        try {
            const reqData = await c.req.json();
            const validatedData = await (0, validationHelper_1.default)(completeUploadData_1.completeUploadData, reqData);
            await S3FileService.completeMultipartUpload(validatedData.file_key, validatedData.upload_id, validatedData.parts);
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, appMessages_1.MULTIPART_UPLOAD_SUCCESS);
        }
        catch (error) {
            throw error;
        }
    }
    async abortMultipartUpload(c) {
        try {
            const reqData = await c.req.json();
            const validatedData = await (0, validationHelper_1.default)(abortUpload_1.abortUploadData, reqData);
            await S3FileService.abortMultipartUpload(validatedData.file_key, validatedData.upload_id);
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, appMessages_1.MULTIPART_UPLOAD_ABORTED);
        }
        catch (error) {
            throw error;
        }
    }
    async listIncompleteParts(c) {
        try {
            const reqData = await c.req.json();
            const validatedData = await (0, validationHelper_1.default)(getUrlsData_1.getUrlsData, reqData);
            const incompleteUploads = await S3FileService.listIncompleteParts(validatedData.file_key, validatedData.upload_id, validatedData.parts);
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, appMessages_1.FETCHED_INCOMPLETE_PARTS, incompleteUploads);
        }
        catch (error) {
            throw error;
        }
    }
    async getUserStorage(c) {
        try {
            const user = c.get('user');
            if (!user) {
                throw new forbiddenException_1.ForbiddenException(appMessages_1.AUTHENTICATION_FAILED);
            }
            const query = c.req.query();
            const filters = filterHelper_1.filterHelper.getFileTypeFilter(query, 'all', user.id);
            const totalStorage = await fileDataServiceProvider_1.fileService.getTotalStorage(filters);
            const totalFileCount = await fileDataServiceProvider_1.fileService.getTotalFileCount(filters);
            const breakdownFilters = filterHelper_1.filterHelper.getBreakdownFilters(user.id);
            const breakdownResult = await fileDataServiceProvider_1.fileService.getStorageBreakdown(breakdownFilters);
            const storageBreakdown = {
                image: { storage: 0, count: 0 },
                media: { storage: 0, count: 0 },
                document: { storage: 0, count: 0 },
                other: { storage: 0, count: 0 },
            };
            breakdownResult.forEach((row) => {
                const fileType = row.fileType;
                if (fileType in storageBreakdown) {
                    storageBreakdown[fileType].storage = row.storage;
                    storageBreakdown[fileType].count = row.count;
                }
            });
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, appMessages_1.STORAGE_FETCHED, {
                user_id: user.id,
                totalStorage,
                totalStorageInMB: (totalStorage / (1024 * 1024)).toFixed(2),
                totalFileCount,
                storageBreakdown,
            });
        }
        catch (error) {
            throw error;
        }
    }
    async deleteMultipleFiles(c) {
        try {
            const category_id = +c.req.param('category_id');
            const { ids: file_ids } = await c.req.json();
            const fileData = await fileDataServiceProvider_1.fileService.deleteFilesByIds(category_id, file_ids);
            if (fileData.length === 0) {
                throw new notFounException_1.NotFoundException(appMessages_2.NO_FILES_FOUND);
            }
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, appMessages_1.FILES_ARCHIVED, fileData);
        }
        catch (error) {
            throw error;
        }
    }
    async getAllFiles(c) {
        try {
            const query = c.req.query();
            const user = c.get('user');
            const page = parseInt(query.page || '1', 10);
            const limit = parseInt(query.limit || '10', 10);
            const skip = (page - 1) * limit;
            query.uploaded_by = user.id;
            const filters = filterHelper_1.filterHelper.filesFilter(query);
            const sort = sortHelper_1.sortHelper.userWiseSort(query);
            const [files, totalCount] = await Promise.all([
                fileDataServiceProvider_1.fileService.findAllUserwise({ offset: skip, limit, filters, sort }),
                fileDataServiceProvider_1.fileService.getCount(filters),
            ]);
            const updatedFiles = await Promise.all(files.map(async (file) => {
                const slug = file.path;
                const presignedUrl = await S3FileService.generateDownloadFilePresignedURL(slug);
                return { ...file, url: presignedUrl };
            }));
            const paginationData = paginationHelper_2.default.getPaginationResponse({
                page,
                count: totalCount,
                limit,
                skip,
                data: updatedFiles,
                message: appMessages_1.FILES_FETCHED,
                searchString: query.search_string
            });
            return c.json(paginationData);
        }
        catch (error) {
            throw error;
        }
    }
    // trash bin apis
    async getArchivedFiles(c) {
        try {
            const query = c.req.query();
            const user = c.get('user');
            const page = parseInt(query.page || '1', 10);
            const limit = parseInt(query.limit || '10', 10);
            const skip = (page - 1) * limit;
            query.uploaded_by = user.id;
            const filters = filterHelper_1.filterHelper.archivedFilesFilter(query);
            const sort = sortHelper_1.sortHelper.dynamicSort(query.sort_by, query.sort_type);
            const [files, totalCount] = await Promise.all([
                fileDataServiceProvider_1.fileService.findAll({ offset: skip, limit, filters, sort }),
                fileDataServiceProvider_1.fileService.getCount(filters),
            ]);
            const updatedFiles = await Promise.all(files.map(async (file) => {
                const slug = file.path;
                const presignedUrl = await S3FileService.generateDownloadFilePresignedURL(slug);
                return { ...file, url: presignedUrl };
            }));
            const paginationData = paginationHelper_2.default.getPaginationResponse({
                page,
                count: totalCount,
                limit,
                skip,
                data: updatedFiles,
                message: appMessages_1.FILES_FETCHED,
                searchString: query.search_string
            });
            return c.json(paginationData);
        }
        catch (error) {
            throw error;
        }
    }
    async deleteArchivedFiles(c) {
        try {
            const user = c.get('user');
            if (!user || !user.id) {
                throw new forbiddenException_1.ForbiddenException(appMessages_1.AUTHENTICATION_FAILED);
            }
            const userId = user.id;
            const archivedFiles = await fileDataServiceProvider_1.fileService.getArchivedFilesByUser(userId);
            if (archivedFiles.length === 0) {
                throw new notFounException_1.NotFoundException(appMessages_2.NO_FILES_FOUND);
            }
            const deletedFiles = await fileDataServiceProvider_1.fileService.deleteArchivedFiles(archivedFiles);
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, appMessages_1.FILES_DELETED, deletedFiles);
        }
        catch (error) {
            throw error;
        }
    }
    async updateArchivedFilesToActive(c) {
        try {
            const user = c.get('user');
            if (!user || !user.id) {
                throw new forbiddenException_1.ForbiddenException(appMessages_1.AUTHENTICATION_FAILED);
            }
            const userId = user.id;
            const archivedFiles = await fileDataServiceProvider_1.fileService.getArchivedFilesByUser(userId);
            if (archivedFiles.length === 0) {
                throw new notFounException_1.NotFoundException(appMessages_2.NO_FILES_FOUND);
            }
            const updatedFiles = await fileDataServiceProvider_1.fileService.updateFilesStatusToActive(archivedFiles);
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, 'Files status updated to active', updatedFiles);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.fileController = new FileController();
