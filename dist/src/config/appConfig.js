"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.appConfig = {
    PORT: Number(process.env.PORT),
    dbUser: String(process.env.DB_USER),
    dbName: String(process.env.DB_NAME),
    dbUrl: String(process.env.DB_URL),
    dbPassword: String(process.env.DB_PASSWORD),
    dbHost: String(process.env.DB_HOST),
    dbPort: Number(process.env.DB_PORT),
    dbCa: process.env.DB_CA,
};
