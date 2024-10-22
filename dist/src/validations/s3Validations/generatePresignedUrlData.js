"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePresignedUrlData = void 0;
const valibot_1 = require("valibot");
const appMessages_1 = require("../../constants/appMessages");
// Validation schema for generating presigned URL
exports.generatePresignedUrlData = (0, valibot_1.object)({
    fileName: (0, valibot_1.pipe)((0, valibot_1.string)("File name must be a string"), // Must be a string
    (0, valibot_1.minLength)(1, appMessages_1.FILE_NAME_REQUIRED) // Minimum length of 3 characters
    ),
    fileType: (0, valibot_1.pipe)((0, valibot_1.string)(), // Must be a string
    (0, valibot_1.minLength)(1, appMessages_1.FILE_TYPE_REQUIRED) // Required field
    ),
    fileSize: (0, valibot_1.pipe)((0, valibot_1.number)(), // Must be a number
    (0, valibot_1.number)(appMessages_1.FILE_SIZE_IS_NUMBER) // Validates that file_size is a number
    )
});
