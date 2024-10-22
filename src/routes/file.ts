import { Hono } from 'hono';
import { fileController } from '../controllers/fileController';
import { AuthMiddleware } from '../middlewares/authMiddleware';

const authMiddleware = new AuthMiddleware();
export const fileRoutes = new Hono();

// Apply auth middleware for all routes
fileRoutes.use('*', authMiddleware.checkAuthHeader, authMiddleware.validateAccessToken);

// File-related routes
fileRoutes.get('/', fileController.getAllFiles);
fileRoutes.get('/user/archived', fileController.getArchivedFiles);
fileRoutes.delete('/user/archived', fileController.deleteArchivedFiles);
fileRoutes.patch('/user/archived-to-active', fileController.updateArchivedFilesToActive);
fileRoutes.delete('/:file_id', fileController.deleteNewFileById);

export default fileRoutes;
