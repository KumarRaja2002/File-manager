"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseException_1 = __importDefault(require("./baseException"));
class UnprocessableContentException extends baseException_1.default {
    constructor(message, errData) {
        super(message, 422, errData, true);
    }
}
exports.default = UnprocessableContentException;
