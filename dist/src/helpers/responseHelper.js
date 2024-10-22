"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHelper = void 0;
class ResponseHelper {
    static sendSuccessResponse(c, status, message = "", data = []) {
        let responseBody = {
            success: true,
            message,
            status: status,
            data
        };
        c.status(status);
        return c.json(responseBody);
    }
    static sendErrorResponse(c, status, message = "", data = [], errors = {}) {
        let responseBody = {
            success: false,
            message,
            errors,
            status: status,
            data
        };
        c.status(status);
        return c.json(responseBody);
    }
    static sendValidationErrorResponse(c, status, message, errors) {
        let responseBody = {
            success: false,
            status,
            errors,
            message,
            data: null
        };
        c.status(status);
        return c.json(responseBody);
    }
}
exports.ResponseHelper = ResponseHelper;
