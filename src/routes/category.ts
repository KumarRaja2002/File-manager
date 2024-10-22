import { Context, Hono } from 'hono';
import { CategoryController } from '../controllers/categoryController';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { fileController } from '../controllers/fileController';

const app = new Hono();
const categoryController = new CategoryController();
const authMiddleware = new AuthMiddleware();

// Apply auth middleware for all routes
app.use('*', authMiddleware.checkAuthHeader, authMiddleware.validateAccessToken);

// Category-related routes
app.post('/', categoryController.create);
app.get('/:id', categoryController.getOne);
app.put('/:id', categoryController.update);
app.delete('/:id', categoryController.delete);
app.get('/', categoryController.getAllCategories);
app.get('/bin/categories', categoryController.getArchivedCategories);
app.put('/restore/:id', categoryController.restoreCategory);
app.delete('/permanent-delete/:id', categoryController.permenantDelete);
app.get('/dropdown/all', categoryController.getCategories);

// File-related routes under category
app.post('/:id/files/generate-presigned-url', fileController.generatePresignedUrl);
app.post('/:id/files', fileController.addFile);
app.get('/:id/files', fileController.getFiles);
app.get('/:category_id/files/:file_id', fileController.getOne);
app.delete('/:category_id/files/:file_id', fileController.deleteById);
app.post('/:id/files/download-url', fileController.generateDownloadPresignedUrl);
app.delete('/:category_id/files/delete-multiple/new', fileController.deleteMultipleFiles);
app.patch('/:category_id/files/:file_id', fileController.updateSingleFile);
app.get('/storage/user', fileController.getUserStorage);


// Additional file-related routes with multipart upload
app.post('/:id/files/start', fileController.initializeMultipartUpload);
app.post('/:id/files/urls', fileController.getMultipartUploadUrls);
app.post('/:id/files/complete', fileController.completeMultipartUpload);
app.post('/:id/files/abort', fileController.abortMultipartUpload);
app.post('/:id/files/list-incomplete-parts', fileController.listIncompleteParts);

export default app;
