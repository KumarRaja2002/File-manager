"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategorySchema = void 0;
const valibot_1 = require("valibot");
const appMessages_1 = require("../../../constants/appMessages");
//@ts-ignore
exports.createCategorySchema = (0, valibot_1.object)({
    name: (0, valibot_1.pipe)(
    //@ts-ignore
    (0, valibot_1.string)(appMessages_1.CATEGORY_STRING), (0, valibot_1.nonEmpty)(appMessages_1.CATEGORY_NON_EMPTY), (0, valibot_1.regex)(/(.|\s)*\S(.|\s)*/, appMessages_1.CATEGORY_NON_EMPTY)),
    description: (0, valibot_1.nullish)(
    //@ts-ignore
    (0, valibot_1.string)(appMessages_1.DESCRIPTION)),
    slug: (0, valibot_1.nullish)(
    //@ts-ignore
    (0, valibot_1.string)()),
    created_by: (0, valibot_1.nullish)(
    //@ts-ignore
    (0, valibot_1.number)()),
    updated_by: (0, valibot_1.nullish)(
    //@ts-ignore
    (0, valibot_1.number)())
});
