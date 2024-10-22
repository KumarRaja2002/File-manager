"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapFileResponse = void 0;
const s3DataServiceProvider_1 = require("../services/s3Service/s3DataServiceProvider");
const categoryDataServiceProvider_1 = require("../services/database/categoryDataServiceProvider");
const S3FileService = new s3DataServiceProvider_1.s3FileService();
const categoryService = new categoryDataServiceProvider_1.CategoryService();
const mapFileResponse = async (file) => {
    const presignedUrl = await S3FileService.generateDownloadFilePresignedURL(file.path);
    const categoryName = await getCategoryNameById(file.category_id);
    return {
        file_id: file.id, // changing id to file_id
        title: file.title,
        name: file.name,
        mime_type: file.mime_type,
        size: file.size,
        path: file.path,
        uploaded_at: file.uploaded_at,
        status: file.status,
        category_id: file.category_id,
        category_name: categoryName, // Adding category_name
        type: file.type,
        created_at: file.created_at,
        updated_at: file.updated_at,
        url: presignedUrl // Renaming downloadUrl to url
    };
};
exports.mapFileResponse = mapFileResponse;
async function getCategoryNameById(categoryId) {
    const category = await categoryService.findCategoryById(categoryId);
    return category ? category.name : 'Unknown';
}
