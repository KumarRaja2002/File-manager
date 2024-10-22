"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const db_1 = require("../../lib/db");
const category_1 = require("../../schemas/category");
const file_1 = require("../../schemas/file");
const drizzle_orm_1 = require("drizzle-orm");
const dbClient_1 = require("../../dbClient/dbClient");
class CategoryService {
    async createCategory(categoryData) {
        const newCategory = await (0, dbClient_1.addSingleRecord)(category_1.categories, categoryData);
        return newCategory;
    }
    async findCategoryByName(name, excludeId) {
        const lowerCaseName = name.trim().toLowerCase();
        return await (0, dbClient_1.getCategoryByColumn)(category_1.categories, 'name', lowerCaseName, excludeId);
    }
    // public async findCategories(createdBy: number) {
    //   return await db
    //     .select({
    //       id: categories.id,
    //       name: categories.name
    //     })
    //     .from(categories)
    //     .where(and(eq(categories.created_by, createdBy), eq(categories.status, 'active')))
    //     .orderBy(asc(categories.name)); 
    // }
    async findCategories(filters) {
        return await db_1.db
            .select({
            id: category_1.categories.id,
            name: category_1.categories.name
        })
            .from(category_1.categories)
            .where((0, drizzle_orm_1.and)(...filters))
            .orderBy((0, drizzle_orm_1.asc)(category_1.categories.name));
    }
    async findCategoryById(id) {
        return await (0, dbClient_1.getRecordByColumn)(category_1.categories, 'id', id);
    }
    async updateCategoryById(categoryData, id) {
        return await (0, dbClient_1.updateSingleRecord)(category_1.categories, categoryData, id);
    }
    async deleteCategoryById(id) {
        return await db_1.db.transaction(async (trx) => {
            const categoryData = await trx.update(category_1.categories)
                .set({ status: 'archieved' })
                .where((0, drizzle_orm_1.eq)(category_1.categories.id, id))
                .returning();
            await trx.update(file_1.files)
                .set({ status: 'archieved' })
                .where((0, drizzle_orm_1.eq)(file_1.files.category_id, id));
            return categoryData;
        });
    }
    async restoreCategoryById(id) {
        return await db_1.db.transaction(async (trx) => {
            const categoryData = await trx.update(category_1.categories)
                .set({ status: 'active' })
                .where((0, drizzle_orm_1.eq)(category_1.categories.id, id))
                .returning();
            await trx.update(file_1.files)
                .set({ status: 'active' })
                .where((0, drizzle_orm_1.eq)(file_1.files.category_id, id));
            return categoryData;
        });
    }
    async findAll({ offset, limit, filters, sort }) {
        const query = db_1.db
            .select({
            id: category_1.categories.id,
            name: category_1.categories.name,
            slug: category_1.categories.slug,
            // description: categories.description,
            status: category_1.categories.status,
            files_count: (0, drizzle_orm_1.count)((0, drizzle_orm_1.sql) `CASE WHEN ${file_1.files.status} = 'active' THEN 1 ELSE NULL END`),
            // created_by: categories.created_by,
            // updated_by: categories.updated_by,
            created_at: category_1.categories.created_at,
            updated_at: category_1.categories.updated_at
        })
            .from(category_1.categories)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(category_1.categories.status, "active")))
            .leftJoin(file_1.files, (0, drizzle_orm_1.eq)(category_1.categories.id, file_1.files.category_id))
            .groupBy(category_1.categories.id);
        if (filters) {
            query.where((0, drizzle_orm_1.sql) `${drizzle_orm_1.sql.raw(filters)}`);
        }
        if (sort) {
            query.orderBy((0, drizzle_orm_1.sql) `${drizzle_orm_1.sql.raw(sort)}`);
        }
        query.limit(limit).offset(offset);
        return query.execute();
    }
    async getCount(filters) {
        const query = db_1.db
            .select({ count: (0, drizzle_orm_1.sql) `COUNT(*)` })
            .from(category_1.categories);
        if (filters) {
            query.where((0, drizzle_orm_1.sql) `${drizzle_orm_1.sql.raw(filters)}`);
        }
        const data = await query.execute();
        return data[0].count;
    }
    async findArchieved({ offset, limit, filters, sort }) {
        const query = db_1.db
            .select({
            id: category_1.categories.id,
            name: category_1.categories.name,
            slug: category_1.categories.slug,
            description: category_1.categories.description,
            status: category_1.categories.status,
            files_count: (0, drizzle_orm_1.count)((0, drizzle_orm_1.sql) `CASE WHEN ${file_1.files.status} = 'archieved' THEN 1 ELSE NULL END`), // Count archived files
            created_by: category_1.categories.created_by,
            updated_by: category_1.categories.updated_by,
            created_at: category_1.categories.created_at,
            updated_at: category_1.categories.updated_at
        })
            .from(category_1.categories)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(category_1.categories.status, "archieved")))
            .leftJoin(file_1.files, (0, drizzle_orm_1.eq)(category_1.categories.id, file_1.files.category_id))
            .groupBy(category_1.categories.id);
        if (filters) {
            query.where((0, drizzle_orm_1.sql) `${drizzle_orm_1.sql.raw(filters)}`);
        }
        if (sort) {
            query.orderBy((0, drizzle_orm_1.sql) `${drizzle_orm_1.sql.raw(sort)}`);
        }
        query.limit(limit).offset(offset);
        return query.execute();
    }
    async permanentDeleteCategoryById(categoryId) {
        return await db_1.db.transaction(async (trx) => {
            await trx
                .delete(file_1.files)
                .where((0, drizzle_orm_1.eq)(file_1.files.category_id, categoryId));
            const deletedCategory = await trx
                .delete(category_1.categories)
                .where((0, drizzle_orm_1.eq)(category_1.categories.id, categoryId))
                .returning();
            return deletedCategory[0];
        });
    }
}
exports.CategoryService = CategoryService;
