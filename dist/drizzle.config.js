"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
const appConfig_1 = __importDefault(require("./config/appConfig"));
exports.default = (0, drizzle_kit_1.defineConfig)({
    dialect: "postgresql",
    schema: "./src/schemas/*.ts",
    out: "./drizzle",
    dbCredentials: {
        user: appConfig_1.default.db.dbUser,
        password: appConfig_1.default.db.dbPassword,
        host: appConfig_1.default.db.dbHost,
        port: appConfig_1.default.db.dbPort,
        database: appConfig_1.default.db.dbName,
        ssl: {
            rejectUnauthorized: true,
            ca: appConfig_1.default.db.dbCa
        },
    },
});
