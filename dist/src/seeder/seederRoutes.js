"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seederRouter = void 0;
const hono_1 = require("hono");
const seederController_1 = require("../seeder/seederController");
const seederController = new seederController_1.SeederController();
exports.seederRouter = new hono_1.Hono();
exports.seederRouter.post('/seed-users', seederController.seedUsers.bind(seederController));
exports.seederRouter.post('/seed-categories', seederController.seedCategories.bind(seederController));
exports.seederRouter.post('/seed-files', seederController.seedFiles.bind(seederController));