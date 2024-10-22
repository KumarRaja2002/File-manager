"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const v = __importStar(require("valibot"));
const appMessages_1 = require("../constants/appMessages");
const unproccessableContentException_1 = __importDefault(require("../exceptions/unproccessableContentException"));
const validate = (schema, data) => {
    //@ts-ignore
    const validatedData = v.safeParse(schema, data, { abortPipeEarly: true });
    if (!validatedData.success) {
        const issues = v.flatten(validatedData.issues);
        throw new unproccessableContentException_1.default(appMessages_1.VALIDATION_FAILED, issues.nested);
    }
    else {
        return validatedData.output;
    }
};
exports.default = validate;
