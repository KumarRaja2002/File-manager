"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInSchema = void 0;
const valibot_1 = require("valibot");
const appMessages_1 = require("../../constants/appMessages");
exports.SignInSchema = (0, valibot_1.object)({
    email: (0, valibot_1.pipe)((0, valibot_1.string)(appMessages_1.EMAIL_STRING), (0, valibot_1.nonEmpty)(appMessages_1.EMAIL_REQUIRED), (0, valibot_1.email)(appMessages_1.EMAIL_INVALID)),
    password: (0, valibot_1.pipe)((0, valibot_1.string)(appMessages_1.PASSWORD_STRING), (0, valibot_1.nonEmpty)(appMessages_1.PASSWORD_REQUIRED)),
});
