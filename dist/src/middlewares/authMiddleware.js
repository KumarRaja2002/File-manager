"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userDataServiceProvider_1 = require("../services/database/userDataServiceProvider");
const appConfig_1 = __importDefault(require("../../config/appConfig"));
const unauthorisedException_1 = require("../exceptions/unauthorisedException");
const forbiddenException_1 = require("../exceptions/forbiddenException");
const userDataServiceProvider = new userDataServiceProvider_1.UserDataServiceProvider();
class AuthMiddleware {
    async checkAuthHeader(c, next) {
        const authHeader = c.req.header("authorization");
        if (!c.req.header("authorization")) {
            throw new unauthorisedException_1.UnauthorisedException("No Authorization Token");
        }
        await next();
    }
    ;
    async validateAccessToken(c, next) {
        try {
            const accessToken = c.req.header("authorization") || "";
            if (accessToken) {
                const decodedToken = await jsonwebtoken_1.default.decode(accessToken);
                if (!decodedToken) {
                    throw new forbiddenException_1.ForbiddenException('Forbidden - Invalid Token');
                }
                const user = await userDataServiceProvider.findUserById(decodedToken.id);
                if (user) {
                    const tokenSecret = appConfig_1.default.jwt.token_secret + user.password;
                    await jsonwebtoken_1.default.verify(accessToken, tokenSecret);
                    c.set("user", user);
                    await next();
                }
                else {
                    throw new forbiddenException_1.ForbiddenException('Access Denied - User not found');
                }
            }
            else {
                throw new forbiddenException_1.ForbiddenException('Forbidden - Token is required');
            }
        }
        catch (error) {
            throw error;
        }
    }
}
exports.AuthMiddleware = AuthMiddleware;
