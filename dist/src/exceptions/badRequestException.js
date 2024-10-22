"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestException = void 0;
const baseException_1 = __importDefault(require("./baseException"));
class BadRequestException extends baseException_1.default {
    constructor(message) {
        super(message, 400);
    }
}
exports.BadRequestException = BadRequestException;