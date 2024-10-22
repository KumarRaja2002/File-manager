"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3FileService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const s3Exceptions_1 = __importDefault(require("../../exceptions/s3Exceptions"));
const appConfig_1 = __importDefault(require("../../../config/appConfig"));
class s3FileService {
    constructor() {
        this.config = {
            credentials: {
                accessKeyId: appConfig_1.default.s3.accessKeyId,
                secretAccessKey: appConfig_1.default.s3.secretAccessKey
            },
            region: appConfig_1.default.s3.bucket_region,
            s3_bucket: appConfig_1.default.s3.s3_bucket,
            expires: 3600
        };
        this.s3Client = new client_s3_1.S3Client(this.config);
    }
    // Generate presigned URL for file upload
    async generatePresignedUrl(file_name, file_type, file_size, category_name) {
        const slug = category_name;
        const path = `${slug}/${file_name}`;
        const params = {
            Bucket: appConfig_1.default.s3.s3_bucket,
            Key: path,
            ContentType: file_type
        };
        try {
            const command = new client_s3_1.PutObjectCommand(params);
            const presignedUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn: 3600 });
            return { presignedUrl, path };
        }
        catch (error) {
            console.error("Error generating presigned URL:", error);
            throw error;
        }
    }
    // Generate presigned URL for downloading a file
    async generateDownloadFilePresignedURL(key) {
        if (!key) {
            throw new Error("The 'key' parameter (file path) is required.");
        }
        const params = {
            Bucket: appConfig_1.default.s3.s3_bucket,
            Key: key
        };
        try {
            const command = new client_s3_1.GetObjectCommand(params);
            const presignedUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn: this.config.expires });
            return presignedUrl;
        }
        catch (error) {
            throw error;
        }
    }
    // Initialize multipart upload
    async initializeMultipartUpload(slug, fileName) {
        try {
            let key = slug ? `${slug}/` : '';
            key += fileName;
            const input = {
                Bucket: appConfig_1.default.s3.s3_bucket,
                Key: key
            };
            const command = new client_s3_1.CreateMultipartUploadCommand(input);
            const response = await this.s3Client.send(command);
            return response;
        }
        catch (error) {
            if (error instanceof client_s3_1.S3ServiceException) {
                const statusCode = error.$metadata.httpStatusCode;
                throw new s3Exceptions_1.default(error.message, statusCode, error);
            }
            throw error;
        }
    }
    // Generate presigned URLs for multipart upload
    async multipartPresignedUrl(fileKey, parts, uploadId) {
        try {
            const urls = [];
            for (let i = 0; i < parts; i++) {
                const baseParams = {
                    Bucket: appConfig_1.default.s3.s3_bucket,
                    Key: fileKey,
                    UploadId: uploadId,
                    PartNumber: i + 1
                };
                const presignCommand = new client_s3_1.UploadPartCommand(baseParams);
                urls.push(await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, presignCommand, { expiresIn: 3600 }));
            }
            return await Promise.all(urls);
        }
        catch (error) {
            if (error instanceof client_s3_1.S3ServiceException) {
                const statusCode = error.$metadata.httpStatusCode;
                throw new s3Exceptions_1.default(error.message, statusCode, error);
            }
            throw error;
        }
    }
    // Complete multipart upload
    async completeMultipartUpload(fileKey, uploadId, uploadedParts) {
        try {
            const input = {
                Bucket: appConfig_1.default.s3.s3_bucket,
                Key: fileKey,
                UploadId: uploadId,
                MultipartUpload: {
                    Parts: uploadedParts
                }
            };
            const command = new client_s3_1.CompleteMultipartUploadCommand(input);
            const response = await this.s3Client.send(command);
            return response;
        }
        catch (error) {
            if (error instanceof client_s3_1.S3ServiceException) {
                const statusCode = error.$metadata.httpStatusCode;
                throw new s3Exceptions_1.default(error.message, statusCode, error);
            }
            throw error;
        }
    }
    // Abort multipart upload
    async abortMultipartUpload(filekey, uploadId) {
        try {
            const input = {
                Bucket: appConfig_1.default.s3.s3_bucket,
                Key: filekey,
                UploadId: uploadId
            };
            const command = new client_s3_1.AbortMultipartUploadCommand(input);
            const response = await this.s3Client.send(command);
            return response;
        }
        catch (error) {
            if (error instanceof client_s3_1.S3ServiceException) {
                const statusCode = error.$metadata.httpStatusCode;
                throw new s3Exceptions_1.default(error.message, statusCode, error);
            }
            throw error;
        }
    }
    // List incomplete parts of a multipart upload
    async listIncompleteParts(fileKey, uploadId, totalParts) {
        try {
            const input = {
                Bucket: appConfig_1.default.s3.s3_bucket,
                Key: fileKey,
                UploadId: uploadId
            };
            const command = new client_s3_1.ListPartsCommand(input);
            const listPartsResponse = await this.s3Client.send(command);
            const uploadedPartNumbers = new Set(listPartsResponse.Parts?.map((part) => part.PartNumber));
            const incompleteParts = [];
            for (let i = 1; i <= totalParts; i++) {
                if (!uploadedPartNumbers.has(i)) {
                    incompleteParts.push(i);
                }
            }
            return incompleteParts;
        }
        catch (error) {
            if (error instanceof client_s3_1.S3ServiceException) {
                const statusCode = error.$metadata.httpStatusCode;
                throw new s3Exceptions_1.default(error.message, statusCode, error);
            }
            throw error;
        }
    }
}
exports.s3FileService = s3FileService;
