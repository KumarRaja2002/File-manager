"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_1 = require("pg");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const appConfig_1 = require("../config/appConfig");
const pool = new pg_1.Pool({
    user: appConfig_1.appConfig.dbUser,
    password: appConfig_1.appConfig.dbPassword,
    host: appConfig_1.appConfig.dbHost,
    port: Number(appConfig_1.appConfig.dbPort),
    database: appConfig_1.appConfig.dbName,
    ssl: {
        rejectUnauthorized: true,
        ca: appConfig_1.appConfig.dbCa,
    },
});
exports.db = (0, node_postgres_1.drizzle)(pool);
