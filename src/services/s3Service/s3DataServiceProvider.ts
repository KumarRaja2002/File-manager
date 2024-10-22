import { 
    S3Client, 
    PutObjectCommand, 
    GetObjectCommand,
    CreateMultipartUploadCommand,
    UploadPartCommand,
    CompleteMultipartUploadCommand,
    AbortMultipartUploadCommand,
    ListPartsCommand,
    S3ServiceException, 
    CompletedPart
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StatusCode } from 'hono/utils/http-status';
import S3Exception from '../../exceptions/s3Exceptions';
import configData from '../../../config/appConfig';

interface Config {
    credentials: {
        accessKeyId: string;
        secretAccessKey: string;
    },
    region: string,
    s3_bucket: string,
    expires: number,
    useAccelerateEndpoint?: boolean
}

export class s3FileService {

    config: Config;
    s3Client: S3Client;
    constructor() {
        this.config = {
            credentials: {
                accessKeyId: configData.s3.accessKeyId,
                secretAccessKey: configData.s3.secretAccessKey
            },
            region: configData.s3.bucket_region,
            s3_bucket: configData.s3.s3_bucket,
            expires: 3600
        };
        this.s3Client = new S3Client(this.config);
    }

    // Generate presigned URL for file upload
    public async generatePresignedUrl(file_name: string, file_type: string, file_size: number, category_name: string) {
        const slug = category_name;

        const path = `${slug}/${file_name}`;

        const params = {
            Bucket: configData.s3.s3_bucket,
            Key: path,
            ContentType: file_type
        };

        try {
            const command = new PutObjectCommand(params);
            const presignedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });


            return { presignedUrl, path };
        } catch (error) {
            console.error("Error generating presigned URL:", error);
            throw error;
        }
    }

    // Generate presigned URL for downloading a file
    public async generateDownloadFilePresignedURL(key: string) {
        if (!key) {
            throw new Error("The 'key' parameter (file path) is required.");
        }

        const params = {
            Bucket: configData.s3.s3_bucket,
            Key: key 
        };

        try {
            const command = new GetObjectCommand(params);

            const presignedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: this.config.expires });

            return presignedUrl;

        } catch (error) {
            throw error;
        }
    }

    // Initialize multipart upload
    public async initializeMultipartUpload(slug: string, fileName: string) {
        try {
            let key = slug ? `${slug}/` : '';
            key += fileName;

            const input = {
                Bucket: configData.s3.s3_bucket,
                Key: key
            };

            const command = new CreateMultipartUploadCommand(input);
            const response = await this.s3Client.send(command);

            return response;
        } catch (error: any) {
            if (error instanceof S3ServiceException) {
                const statusCode: StatusCode = error.$metadata.httpStatusCode as StatusCode;
                throw new S3Exception(error.message, statusCode, error);
            }
            throw error;
        }
    }

    // Generate presigned URLs for multipart upload
    public async multipartPresignedUrl(fileKey: string, parts: number, uploadId: string) {
        try {
            const urls = [];

            for (let i = 0; i < parts; i++) {
                const baseParams = {
                    Bucket: configData.s3.s3_bucket,
                    Key: fileKey,
                    UploadId: uploadId,
                    PartNumber: i + 1
                };

                const presignCommand = new UploadPartCommand(baseParams);
                urls.push(await getSignedUrl(this.s3Client, presignCommand, { expiresIn: 3600 }));
            }

            return await Promise.all(urls);
        } catch (error: any) {
            if (error instanceof S3ServiceException) {
                const statusCode: StatusCode = error.$metadata.httpStatusCode as StatusCode;
                throw new S3Exception(error.message, statusCode, error);
            }
            throw error;
        }
    }

    // Complete multipart upload
    public async completeMultipartUpload(fileKey: string, uploadId: string, uploadedParts: CompletedPart[]) {
        try {
            const input = {
                Bucket: configData.s3.s3_bucket,
                Key: fileKey,
                UploadId: uploadId,
                MultipartUpload: {
                    Parts: uploadedParts
                }
            };

            const command = new CompleteMultipartUploadCommand(input);
            const response = await this.s3Client.send(command);

            return response;
        } catch (error: any) {
            if (error instanceof S3ServiceException) {
                const statusCode: StatusCode = error.$metadata.httpStatusCode as StatusCode;
                throw new S3Exception(error.message, statusCode, error);
            }
            throw error;
        }
    }

    // Abort multipart upload
    public async abortMultipartUpload(filekey: string, uploadId: string) {
        try {
            const input = {
                Bucket: configData.s3.s3_bucket,
                Key: filekey,
                UploadId: uploadId
            };

            const command = new AbortMultipartUploadCommand(input);
            const response = await this.s3Client.send(command);

            return response;
        } catch (error: any) {
            if (error instanceof S3ServiceException) {
                const statusCode: StatusCode = error.$metadata.httpStatusCode as StatusCode;
                throw new S3Exception(error.message, statusCode, error);
            }
            throw error;
        }
    }

    // List incomplete parts of a multipart upload
    public async listIncompleteParts(fileKey: string, uploadId: string, totalParts: number) {
        try {
            const input = {
                Bucket: configData.s3.s3_bucket,
                Key: fileKey,
                UploadId: uploadId
            };

            const command = new ListPartsCommand(input);
            const listPartsResponse = await this.s3Client.send(command);

            const uploadedPartNumbers = new Set(
                listPartsResponse.Parts?.map((part: any) => part.PartNumber)
            );

            const incompleteParts = [];
            for (let i = 1; i <= totalParts; i++) {
                if (!uploadedPartNumbers.has(i)) {
                    incompleteParts.push(i);
                }
            }

            return incompleteParts;
        } catch (error: any) {
            if (error instanceof S3ServiceException) {
                const statusCode: StatusCode = error.$metadata.httpStatusCode as StatusCode;
                throw new S3Exception(error.message, statusCode, error);
            }
            throw error;
        }
    }

}

