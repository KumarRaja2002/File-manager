import { s3FileService } from '../services/s3Service/s3DataServiceProvider';
import { CategoryService } from '../services/database/categoryDataServiceProvider';

const S3FileService = new s3FileService();
const categoryService = new CategoryService();



export const mapFileResponse = async (file: any): Promise<any> => {
    const presignedUrl = await S3FileService.generateDownloadFilePresignedURL(file.path);
    const categoryName = await getCategoryNameById(file.category_id);

    return {
        file_id: file.id,  // changing id to file_id
        title: file.title,
        name: file.name,
        mime_type: file.mime_type,
        size: file.size,
        path: file.path,
        uploaded_at: file.uploaded_at,
        status: file.status,
        category_id: file.category_id,
        category_name: categoryName,  // Adding category_name
        type: file.type,
        created_at: file.created_at,
        updated_at: file.updated_at,
        url: presignedUrl // Renaming downloadUrl to url
    };
};

async function getCategoryNameById(categoryId: number): Promise<string> {
    const category = await categoryService.findCategoryById(categoryId);
    return category ? category.name : 'Unknown';
}
