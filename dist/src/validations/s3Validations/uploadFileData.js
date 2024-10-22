"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileData = void 0;
const valibot_1 = require("valibot");
const appMessages_1 = require("../../constants/appMessages");
exports.uploadFileData = (0, valibot_1.object)({
    original_name: (0, valibot_1.pipe)((0, valibot_1.string)(appMessages_1.FILE_NAME_IS_STRING), (0, valibot_1.nonEmpty)(appMessages_1.FILE_ORIGINAL_NAME_REQUIRED), (0, valibot_1.minLength)(5, appMessages_1.FILE_ORIGINAL_NAME_AT_LEAST_5_CHARACTERS)),
    file_type: (0, valibot_1.pipe)((0, valibot_1.string)(appMessages_1.FILE_TYPE_STRING), (0, valibot_1.nonEmpty)(appMessages_1.FILE_TYPE_REQUIRED)),
    file_size: (0, valibot_1.nullish)((0, valibot_1.number)(appMessages_1.FILE_SIZE_IS_NUMBER))
});
