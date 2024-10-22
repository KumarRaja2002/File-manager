"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = void 0;
const valibot_1 = require("valibot");
const validationSchema_1 = require("../validations/validationSchema");
const appMessages_1 = require("../constants/appMessages");
const responseHelper_1 = require("../helpers/responseHelper");
class ValidationMiddleware {
    async validate(c, next) {
        try {
            const schema = validationSchema_1.LoginSchema;
            if (!schema) {
                throw new Error('Validation schema is not defined.');
            }
            const body = await c.req.json();
            // @ts-ignore
            const result = await (0, valibot_1.safeParse)(schema, body, { abortPipeEarly: true });
            if (result.issues) {
                const flatData = (0, valibot_1.flatten)(result.issues);
                console.log(flatData);
                return responseHelper_1.ResponseHelper.sendValidationErrorResponse(c, 422, appMessages_1.VALIDATION_FAILED, flatData.nested);
            }
            await next();
        }
        catch (error) {
            console.log('issue in validations');
            console.log(error);
            throw error;
        }
    }
}
exports.validationMiddleware = new ValidationMiddleware();
