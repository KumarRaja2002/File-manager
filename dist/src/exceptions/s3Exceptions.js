"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseException_1 = __importDefault(require("./baseException"));
class S3Exception extends baseException_1.default {
    constructor(message, status, errData, isOperational = true) {
        super(message, status, errData, isOperational);
    }
}
exports.default = S3Exception;
