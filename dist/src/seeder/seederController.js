"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederController = void 0;
const seederService_1 = require("../seeder/seederService");
const seederService = new seederService_1.SeederService();
class SeederController {
    async seedUsers(c) {
        try {
            const usersData = await seederService.seedUsers();
            return c.json({ message: 'Users seeded successfully!', data: usersData });
        }
        catch (error) {
            console.error('Failed to seed users:', error);
            return c.json({ message: 'Failed to seed users.', error }, 500);
        }
    }
    async seedCategories(c) {
        try {
            await seederService.seedCategories();
            return c.json({ message: 'Categories seeded successfully!' });
        }
        catch (error) {
            console.error('Failed to seed categories:', error);
            return c.json({ message: 'Failed to seed categories.', error }, 500);
        }
    }
    async seedFiles(c) {
        try {
            await seederService.seedFiles();
            return c.json({ message: 'Files seeded successfully!' });
        }
        catch (error) {
            console.error('Failed to seed files:', error);
            return c.json({ message: 'Failed to seed files.', error }, 500);
        }
    }
}
exports.SeederController = SeederController;
