"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_1 = require("pg");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const appConfig_1 = __importDefault(require("../../config/appConfig"));
const pool = new pg_1.Pool({
    user: appConfig_1.default.db.dbUser,
    password: appConfig_1.default.db.dbPassword,
    host: appConfig_1.default.db.dbHost,
    port: Number(appConfig_1.default.db.dbPort),
    database: appConfig_1.default.db.dbName,
    ssl: {
        rejectUnauthorized: true,
        ca: appConfig_1.default.db.dbCa,
    },
});
exports.db = (0, node_postgres_1.drizzle)(pool);
