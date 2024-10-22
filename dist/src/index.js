"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_server_1 = require("@hono/node-server");
const hono_1 = require("hono");
const seederRoutes_1 = require("../src/seeder/seederRoutes");
const category_1 = __importDefault(require("../src/routes/category"));
const appConfig_1 = __importDefault(require("../config/appConfig"));
const user_1 = require("./routes/user");
const file_1 = __importDefault(require("./routes/file"));
const cors_1 = require("hono/cors");
const logger_1 = require("hono/logger");
const app = new hono_1.Hono();
app.use("*", (0, cors_1.cors)());
app.use((0, logger_1.logger)());
app.get('/', (c) => {
    return c.text('Hello Hono!');
});
app.route('/' + appConfig_1.default.app.api_version + '/seed', seederRoutes_1.seederRouter);
app.route('/' + appConfig_1.default.app.api_version + '/categories', category_1.default);
app.route('/' + appConfig_1.default.app.api_version + '/users', user_1.userRoutes);
app.route('/' + appConfig_1.default.app.api_version + '/files', file_1.default);
const port = appConfig_1.default.app.port;
console.log(`Server is running on port ${port}`);
app.onError((err, c) => {
    c.status(err.status || 500);
    return c.json({
        success: false,
        status: err.status || 500,
        message: err.message || 'Something went wrong',
        errors: err.errData || null
    });
});
(0, node_server_1.serve)({
    fetch: app.fetch,
    port
});
// import { serve } from '@hono/node-server';
// import { Context, Hono } from 'hono';
// import { seederRouter } from '../src/seeder/seederRoutes';
// import { fileRoutes } from './routes/file';
// import categoryRoutes from '../src/routes/category'
// import configData from '../config/appConfig';
// import { userRoutes } from './routes/user';
// import { cors } from 'hono/cors';
// import { logger } from 'hono/logger';
// const app = new Hono();
// app.use("*", cors());
// app.use(logger());
// app.get('/', (c) => {
//   return c.text('Hello Hono!');
// });
// app.route('/' + configData.app.api_version +'/seed', seederRouter);
// app.route('/' + configData.app.api_version +'/categories',categoryRoutes)
// app.route('/' + configData.app.api_version + '/files', fileRoutes);
// app.route('/' + configData.app.api_version + '/users', userRoutes);
// const port = configData.app.port;
// console.log(`Server is running on port ${port}`);
// app.onError((err: any, c: Context) => {
//   c.status(err.status || 500)
//   return c.json({
//     success: false,
//     status: err.status || 500,
//     message: err.message || 'Something went wrong',
//     errors: err.errData || null
//   })
// })
// serve({
//   fetch: app.fetch,
//   port
// });
