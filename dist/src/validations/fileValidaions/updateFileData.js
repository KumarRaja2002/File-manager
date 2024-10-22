"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFileData = void 0;
const valibot_1 = require("valibot");
const appMessages_1 = require("../../constants/appMessages");
exports.updateFileData = (0, valibot_1.object)({
    title: (0, valibot_1.pipe)((0, valibot_1.string)(), (0, valibot_1.minLength)(3, appMessages_1.TITLE_IS_REQUIRED), (0, valibot_1.regex)(/^[^\s].*[^\s]$/, appMessages_1.TITLE_IS_REQUIRED)),
});
