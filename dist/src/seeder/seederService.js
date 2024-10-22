"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederService = void 0;
const db_1 = require("../lib/db");
const user_1 = require("../schemas/user");
const category_1 = require("../schemas/category");
const file_1 = require("../schemas/file");
const falso_1 = require("@ngneat/falso");
class SeederService {
    async seedUsers() {
        const usersData = [];
        for (let i = 0; i < 100; i++) {
            usersData.push({
                full_name: (0, falso_1.randFullName)(),
                email: (0, falso_1.randEmail)(),
                phone: (0, falso_1.randPhoneNumber)(),
                password: (0, falso_1.randPassword)(),
                created_at: new Date(),
                updated_at: new Date(),
            });
        }
        await db_1.db.insert(user_1.users).values(usersData);
        console.log('100 users have been seeded successfully!');
        return usersData;
    }
    async seedCategories() {
        const userRecords = await db_1.db.select({ id: user_1.users.id }).from(user_1.users);
        const userIds = userRecords.map(user => user.id);
        const existingSlugs = new Set();
        function generateUniqueSlug(baseSlug) {
            let slug = baseSlug;
            let counter = 1;
            while (existingSlugs.has(slug)) {
                slug = `${baseSlug}-${counter++}`;
            }
            existingSlugs.add(slug);
            return slug;
        }
        const batchSize = 500;
        const categoriesData = [];
        for (const userId of userIds) {
            for (let i = 0; i < 100; i++) {
                const name = (0, falso_1.randProductCategory)();
                const baseSlug = name.replace(/\s+/g, '-').toLowerCase();
                const slug = generateUniqueSlug(baseSlug);
                categoriesData.push({
                    name,
                    slug,
                    description: (0, falso_1.randSentence)(),
                    created_by: userId,
                    updated_by: userId,
                    created_at: new Date(),
                    updated_at: new Date(),
                });
                if (categoriesData.length >= batchSize) {
                    await db_1.db.insert(category_1.categories).values(categoriesData);
                    categoriesData.length = 0;
                }
            }
        }
        if (categoriesData.length > 0) {
            await db_1.db.insert(category_1.categories).values(categoriesData);
        }
        console.log('Categories have been seeded successfully!');
    }
    async seedFiles() {
        const categoryRecords = await db_1.db.select({ id: category_1.categories.id }).from(category_1.categories);
        const categoryIds = categoryRecords.map(category => category.id);
        const batchSize = 500;
        const filesData = [];
        const validFileTypes = ['image', 'media', 'document', 'other'];
        const validStatuses = ['active', 'archieved'];
        for (const categoryId of categoryIds) {
            for (let i = 0; i < 100; i++) {
                const title = (0, falso_1.randCatchPhrase)();
                const name = `file_${categoryId}_${i}`;
                const mimeType = ['image/jpeg', 'application/pdf', 'video/mp4'][Math.floor(Math.random() * 3)];
                const size = Math.floor(Math.random() * (1048576 - 1024 + 1)) + 1024;
                const path = `/uploads/${categoryId}/${name}`;
                const fileType = validFileTypes[Math.floor(Math.random() * validFileTypes.length)];
                const tags = [`tag_${Math.floor(Math.random() * 100)}`, `tag_${Math.floor(Math.random() * 100)}`];
                const status = validStatuses[Math.floor(Math.random() * validStatuses.length)];
                filesData.push({
                    title,
                    name,
                    mime_type: mimeType,
                    size,
                    path,
                    uploaded_by: Math.floor(Math.random() * 100) + 1,
                    category_id: categoryId,
                    type: fileType,
                    tags,
                    status,
                    created_at: new Date(),
                    updated_at: new Date(),
                });
                if (filesData.length >= batchSize) {
                    await db_1.db.insert(file_1.files).values(filesData);
                    filesData.length = 0;
                }
            }
        }
        if (filesData.length > 0) {
            await db_1.db.insert(file_1.files).values(filesData);
            console.log(filesData);
        }
        console.log('Files have been seeded successfully!');
    }
}
exports.SeederService = SeederService;
