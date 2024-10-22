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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDataServiceProvider = void 0;
const bcrypt = __importStar(require("bcrypt"));
const user_1 = require("../../schemas/user");
const dbClient_1 = require("../../dbClient/dbClient");
class UserDataServiceProvider {
    async create(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;
        return await (0, dbClient_1.addSingleRecord)(user_1.users, userData);
    }
    async findUserByEmail(email) {
        return await (0, dbClient_1.getRecordByColumn)(user_1.users, 'email', email);
    }
    async findUserById(id) {
        return await (0, dbClient_1.getRecordByColumn)(user_1.users, 'id', id);
    }
    async updateUserById(userData, id) {
        return await (0, dbClient_1.updateSingleRecord)(user_1.users, userData, id);
    }
    async deleteUserById(id) {
        return await (0, dbClient_1.deleteSingleRecord)(user_1.users, id);
    }
}
exports.UserDataServiceProvider = UserDataServiceProvider;
