"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceAlreadyExistsException = void 0;
const appMessages_1 = require("../constants/appMessages");
const baseException_1 = __importDefault(require("./baseException"));
class ResourceAlreadyExistsException extends baseException_1.default {
    constructor(key, message) {
        super(message, 409);
        const err = new baseException_1.default(message, 409, true);
        err.status = 409;
        err.message = appMessages_1.VALIDATION_FAILED;
        let errObject = {};
        if (key && message) {
            errObject[key] = message;
        }
        err.errData = errObject;
        return err;
    }
}
exports.ResourceAlreadyExistsException = ResourceAlreadyExistsException;
