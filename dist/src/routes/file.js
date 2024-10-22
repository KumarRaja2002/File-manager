"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileRoutes = void 0;
const hono_1 = require("hono");
const fileController_1 = require("../controllers/fileController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const authMiddleware = new authMiddleware_1.AuthMiddleware();
exports.fileRoutes = new hono_1.Hono();
// Apply auth middleware for all routes
exports.fileRoutes.use('*', authMiddleware.checkAuthHeader, authMiddleware.validateAccessToken);
// File-related routes
exports.fileRoutes.get('/', fileController_1.fileController.getAllFiles);
exports.fileRoutes.get('/user/archived', fileController_1.fileController.getArchivedFiles);
exports.fileRoutes.delete('/user/archived', fileController_1.fileController.deleteArchivedFiles);
exports.fileRoutes.patch('/user/archived-to-active', fileController_1.fileController.updateArchivedFilesToActive);
exports.fileRoutes.delete('/:file_id', fileController_1.fileController.deleteNewFileById);
exports.default = exports.fileRoutes;
