"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundException = void 0;
const baseException_1 = __importDefault(require("./baseException"));
class NotFoundException extends baseException_1.default {
    constructor(message) {
        super(message, 404);
    }
}
exports.NotFoundException = NotFoundException;
