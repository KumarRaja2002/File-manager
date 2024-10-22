"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleFileData = void 0;
const valibot_1 = require("valibot");
const appMessages_1 = require("../../constants/appMessages");
// Validation schema for uploading files
exports.singleFileData = (0, valibot_1.object)(
//@ts-ignore
{
    name: (0, valibot_1.pipe)(
    //@ts-ignore
    (0, valibot_1.string)(), (0, valibot_1.regex)(/(.|\s)*\S(.|\s)*/, appMessages_1.FILE_NAME_REQUIRED), (0, valibot_1.minLength)(1, appMessages_1.FILE_NAME_REQUIRED)),
    title: (0, valibot_1.pipe)(
    //@ts-ignore
    (0, valibot_1.string)(), (0, valibot_1.regex)(/(.|\s)*\S(.|\s)*/, appMessages_1.TITLE_IS_REQUIRED), (0, valibot_1.nonEmpty)()),
    mime_type: (0, valibot_1.pipe)(
    //@ts-ignore
    (0, valibot_1.string)(), (0, valibot_1.regex)(/(.|\s)*\S(.|\s)*/, appMessages_1.MIME_IS_REQUIRED), (0, valibot_1.minLength)(1, appMessages_1.FILE_TYPE_REQUIRED)),
    size: (0, valibot_1.pipe)(
    //@ts-ignore
    (0, valibot_1.number)(), (0, valibot_1.number)(appMessages_1.FILE_SIZE_IS_NUMBER), (0, valibot_1.minLength)(1, appMessages_1.SIZE_IS_REQUIRED)),
    type: (0, valibot_1.pipe)(
    //@ts-ignore
    (0, valibot_1.string)(), (0, valibot_1.picklist)(['image', 'media', 'document', 'other'], appMessages_1.FILE_TYPE_REQUIRED)),
    path: (0, valibot_1.pipe)(
    //@ts-ignore
    (0, valibot_1.string)(), (0, valibot_1.regex)(/(.|\s)*\S(.|\s)*/, appMessages_1.PATH_IS_REQUIRED), (0, valibot_1.minLength)(1, appMessages_1.PATH_IS_REQUIRED)),
    categoryId: (0, valibot_1.optional)(//@ts-ignore
    (0, valibot_1.number)()),
    uploadedBy: (0, valibot_1.optional)(//@ts-ignore
    (0, valibot_1.number)()),
    tags: (0, valibot_1.optional)(//@ts-ignore
    (0, valibot_1.array)((0, valibot_1.string)()))
});
