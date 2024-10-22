import { db } from '../lib/db';
import { users } from '../schemas/user';
import { categories } from '../schemas/category';
import { files } from '../schemas/file';
import { randFullName, randEmail, randPhoneNumber, randPassword, randProductCategory, randSentence,randCatchPhrase } from '@ngneat/falso';

export class SeederService {

    async seedUsers() {
        const usersData = [];

        for (let i = 0; i < 100; i++) {
            usersData.push({
                full_name: randFullName(),
                email: randEmail(),
                phone: randPhoneNumber(),
                password: randPassword(),
                created_at: new Date(),
                updated_at: new Date(),
            });
        }

        await db.insert(users).values(usersData);
        console.log('100 users have been seeded successfully!');
        return usersData;
    }

    async seedCategories() {
        const userRecords = await db.select({ id: users.id }).from(users);
        const userIds = userRecords.map(user => user.id);

        const existingSlugs = new Set<string>();

        function generateUniqueSlug(baseSlug: string): string {
            let slug = baseSlug;
            let counter = 1;
            while (existingSlugs.has(slug)) {
                slug = `${baseSlug}-${counter++}`;
            }
            existingSlugs.add(slug);
            return slug;
        }

        const batchSize = 500;
        const categoriesData: any[] = [];

        for (const userId of userIds) {
            for (let i = 0; i < 100; i++) {
                const name = randProductCategory();
                const baseSlug = name.replace(/\s+/g, '-').toLowerCase();
                const slug = generateUniqueSlug(baseSlug);

                categoriesData.push({
                    name,
                    slug,
                    description: randSentence(),
                    created_by: userId,
                    updated_by: userId,
                    created_at: new Date(),
                    updated_at: new Date(),
                });

                if (categoriesData.length >= batchSize) {
                    await db.insert(categories).values(categoriesData);
                    categoriesData.length = 0;
                }
            }
        }

        if (categoriesData.length > 0) {
            await db.insert(categories).values(categoriesData);
        }

        console.log('Categories have been seeded successfully!');
    }

    async seedFiles() {
        const categoryRecords = await db.select({ id: categories.id }).from(categories);
        const categoryIds = categoryRecords.map(category => category.id);

        const batchSize = 500;
        const filesData: any[] = [];

        const validFileTypes = ['image', 'media', 'document', 'other'];
        const validStatuses = ['active', 'archieved'];

        for (const categoryId of categoryIds) {
            for (let i = 0; i < 100; i++) {
                const title =randCatchPhrase()
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
                    uploaded_by: Math.floor(Math.random() * 100)+1,
                    category_id: categoryId,
                    type: fileType,
                    tags,
                    status,
                    created_at: new Date(),
                    updated_at: new Date(),
                });

                if (filesData.length >= batchSize) {
                    await db.insert(files).values(filesData);
                    filesData.length = 0;
                }
            }
        }

        if (filesData.length > 0) {
            await db.insert(files).values(filesData);
            console.log(filesData)
        }

        console.log('Files have been seeded successfully!');
    }
}
