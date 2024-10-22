"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseException extends Error {
    constructor(message, status, errData, isOperational) {
        super(message);
        this.message = message;
        this.errData = errData;
        this.status = status;
        this.isOperational = isOperational;
    }
}
exports.default = BaseException;
