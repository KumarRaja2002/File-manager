"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.abortUploadData = void 0;
const valibot_1 = require("valibot");
const appMessages_1 = require("../../constants/appMessages");
exports.abortUploadData = (0, valibot_1.object)({
    file_key: (0, valibot_1.pipe)((0, valibot_1.string)(appMessages_1.FILE_KEY_STRING), (0, valibot_1.nonEmpty)(appMessages_1.FILE_KEY_REQUIRED)),
    upload_id: (0, valibot_1.pipe)((0, valibot_1.string)(appMessages_1.UPLOAD_ID_STRING), (0, valibot_1.nonEmpty)(appMessages_1.UPLOAD_ID_REQUIRED)),
});
