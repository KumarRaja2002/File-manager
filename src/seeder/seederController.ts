import { Context } from 'hono';
import { SeederService } from '../seeder/seederService';

const seederService = new SeederService();

export class SeederController {

    async seedUsers(c: Context) {
        try {
            const usersData = await seederService.seedUsers();
            return c.json({ message: 'Users seeded successfully!', data: usersData });
        } catch (error) {
            console.error('Failed to seed users:', error);
            return c.json({ message: 'Failed to seed users.', error }, 500);
        }
    }

    async seedCategories(c: Context) {
        try {
            await seederService.seedCategories();
            return c.json({ message: 'Categories seeded successfully!' });
        } catch (error) {
            console.error('Failed to seed categories:', error);
            return c.json({ message: 'Failed to seed categories.', error }, 500);
        }
    }

    async seedFiles(c: Context) {
        try {
            await seederService.seedFiles();
            return c.json({ message: 'Files seeded successfully!' });
        } catch (error) {
            console.error('Failed to seed files:', error);
            return c.json({ message: 'Failed to seed files.', error }, 500);
        }
    }
}
