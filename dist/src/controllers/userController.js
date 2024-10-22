"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const bcrypt = __importStar(require("bcrypt"));
const appMessages_1 = require("../constants/appMessages");
const notFounException_1 = require("../exceptions/notFounException");
const resourseAlreadyExistsException_1 = require("../exceptions/resourseAlreadyExistsException");
const unauthorisedException_1 = require("../exceptions/unauthorisedException");
const appHelper_1 = require("../helpers/appHelper");
const responseHelper_1 = require("../helpers/responseHelper");
const userDataServiceProvider_1 = require("../services/database/userDataServiceProvider");
const validationHelper_1 = __importDefault(require("../helpers/validationHelper"));
const signIn_1 = require("../validations/user/signIn");
const userDataServiceProvider = new userDataServiceProvider_1.UserDataServiceProvider();
class UserController {
    async signUp(c) {
        try {
            const reqData = await c.req.json();
            const existedUser = await userDataServiceProvider.findUserByEmail(reqData.email);
            if (existedUser) {
                throw new resourseAlreadyExistsException_1.ResourceAlreadyExistsException("email", appMessages_1.EMAIL_EXISTED);
            }
            const userData = await userDataServiceProvider.create(reqData);
            const { password, ...userDataWithoutPassword } = userData;
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, appMessages_1.USER_REGISTERED, userDataWithoutPassword);
        }
        catch (error) {
            throw error;
        }
    }
    async signIn(c) {
        try {
            const reqData = await c.req.json();
            const validatedData = await (0, validationHelper_1.default)(signIn_1.SignInSchema, reqData);
            const userData = await userDataServiceProvider.findUserByEmail(validatedData.email);
            if (!userData) {
                throw new unauthorisedException_1.UnauthorisedException(appMessages_1.INVALID_CREDENTIALS);
            }
            const matchPassword = await bcrypt.compare(validatedData.password, userData.password);
            if (!matchPassword) {
                throw new unauthorisedException_1.UnauthorisedException(appMessages_1.INVALID_CREDENTIALS);
            }
            const { token, refreshToken } = await (0, appHelper_1.getUserAuthTokens)(userData);
            const { password, ...userDataWithoutPassword } = userData;
            let response = {
                user_details: userDataWithoutPassword,
                access_token: token,
                refresh_token: refreshToken
            };
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, appMessages_1.USER_LOGIN, response);
        }
        catch (error) {
            throw error;
        }
    }
    async getOne(c) {
        try {
            const userId = +c.req.param('id');
            const userData = await userDataServiceProvider.findUserById(userId);
            if (!userData) {
                throw new notFounException_1.NotFoundException(appMessages_1.USER_NOT_FOUND);
            }
            const { password, ...userDataWithoutPassword } = userData;
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, appMessages_1.USER_FETCHED, userDataWithoutPassword);
        }
        catch (error) {
            throw error;
        }
    }
    async update(c) {
        try {
            const userId = +c.req.param('id');
            const reqData = await c.req.json();
            const userData = await userDataServiceProvider.findUserById(userId);
            if (!userData) {
                throw new notFounException_1.NotFoundException(appMessages_1.USER_NOT_FOUND);
            }
            const emailExist = await userDataServiceProvider.findUserByEmail(reqData.email);
            if (emailExist && emailExist.id != userId) {
                throw new resourseAlreadyExistsException_1.ResourceAlreadyExistsException("email", appMessages_1.EMAIL_EXISTED);
            }
            await userDataServiceProvider.updateUserById(reqData, userId);
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, appMessages_1.USER_UPDATED);
        }
        catch (error) {
            throw error;
        }
    }
    async delete(c) {
        try {
            const userId = +c.req.param('id');
            const userData = await userDataServiceProvider.findUserById(userId);
            if (!userData) {
                throw new notFounException_1.NotFoundException(appMessages_1.USER_NOT_FOUND);
            }
            await userDataServiceProvider.deleteUserById(userId);
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, appMessages_1.USER_DELETED);
        }
        catch (error) {
            throw error;
        }
    }
    async getProfile(c) {
        try {
            const user = c.get("user");
            const userData = await userDataServiceProvider.findUserById(user.id);
            if (!userData) {
                throw new notFounException_1.NotFoundException(appMessages_1.USER_NOT_FOUND);
            }
            delete userData.password;
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, appMessages_1.USER_FETCHED, userData);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.UserController = UserController;
