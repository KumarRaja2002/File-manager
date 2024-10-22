"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAuthTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appConfig_1 = __importDefault(require("../../config/appConfig"));
const getUserAuthTokens = function (userData) {
    let user = {
        id: userData.id,
        email: userData.email,
        user_type: userData.user_type,
        full_name: userData.full_name,
    };
    let tokenSecret = appConfig_1.default.jwt.token_secret + userData.password;
    let refreshTokenSecret = appConfig_1.default.jwt.refresh_token_secret + userData.password;
    const token = jsonwebtoken_1.default.sign(user, tokenSecret, {
        expiresIn: appConfig_1.default.jwt.token_life,
    });
    const refreshToken = jsonwebtoken_1.default.sign(user, refreshTokenSecret, {
        expiresIn: appConfig_1.default.jwt.refresh_token_life,
    });
    return {
        token,
        refreshToken,
    };
};
exports.getUserAuthTokens = getUserAuthTokens;
