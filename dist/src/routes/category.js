"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const categoryController_1 = require("../controllers/categoryController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const fileController_1 = require("../controllers/fileController");
const app = new hono_1.Hono();
const categoryController = new categoryController_1.CategoryController();
const authMiddleware = new authMiddleware_1.AuthMiddleware();
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
app.post('/:id/files/generate-presigned-url', fileController_1.fileController.generatePresignedUrl);
app.post('/:id/files', fileController_1.fileController.addFile);
app.get('/:id/files', fileController_1.fileController.getFiles);
app.get('/:category_id/files/:file_id', fileController_1.fileController.getOne);
app.delete('/:category_id/files/:file_id', fileController_1.fileController.deleteById);
app.post('/:id/files/download-url', fileController_1.fileController.generateDownloadPresignedUrl);
app.delete('/:category_id/files/delete-multiple/new', fileController_1.fileController.deleteMultipleFiles);
app.patch('/:category_id/files/:file_id', fileController_1.fileController.updateSingleFile);
app.get('/storage/user', fileController_1.fileController.getUserStorage);
// Additional file-related routes with multipart upload
app.post('/:id/files/start', fileController_1.fileController.initializeMultipartUpload);
app.post('/:id/files/urls', fileController_1.fileController.getMultipartUploadUrls);
app.post('/:id/files/complete', fileController_1.fileController.completeMultipartUpload);
app.post('/:id/files/abort', fileController_1.fileController.abortMultipartUpload);
app.post('/:id/files/list-incomplete-parts', fileController_1.fileController.listIncompleteParts);
exports.default = app;
