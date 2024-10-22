import { Hono } from 'hono';
import { SeederController } from '../seeder/seederController';

const seederController = new SeederController();
export const seederRouter = new Hono();

seederRouter.post('/seed-users', seederController.seedUsers.bind(seederController));

seederRouter.post('/seed-categories', seederController.seedCategories.bind(seederController));

seederRouter.post('/seed-files', seederController.seedFiles.bind(seederController));
