"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenException = void 0;
const baseException_1 = __importDefault(require("./baseException"));
class ForbiddenException extends baseException_1.default {
    constructor(message) {
        super(message, 403);
    }
}
exports.ForbiddenException = ForbiddenException;
