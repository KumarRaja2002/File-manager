"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeUploadData = void 0;
const valibot_1 = require("valibot");
const appMessages_1 = require("../../constants/appMessages");
const parts = (0, valibot_1.object)({
    ETag: (0, valibot_1.pipe)((0, valibot_1.string)(appMessages_1.ETAG_STRING), (0, valibot_1.nonEmpty)(appMessages_1.ETAG_REQUIRED)),
    PartNumber: (0, valibot_1.pipe)((0, valibot_1.number)(appMessages_1.PARTS_NUMBER), (0, valibot_1.integer)(appMessages_1.PARTS_NUMBER)),
});
exports.completeUploadData = (0, valibot_1.object)({
    file_key: (0, valibot_1.pipe)((0, valibot_1.string)(appMessages_1.FILE_KEY_STRING), (0, valibot_1.nonEmpty)(appMessages_1.FILE_KEY_REQUIRED)),
    upload_id: (0, valibot_1.pipe)((0, valibot_1.string)(appMessages_1.UPLOAD_ID_STRING), (0, valibot_1.nonEmpty)(appMessages_1.UPLOAD_ID_REQUIRED)),
    parts: (0, valibot_1.pipe)((0, valibot_1.array)(parts), (0, valibot_1.minLength)(1, 'At least one part is required'))
});
