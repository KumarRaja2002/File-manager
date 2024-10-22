"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileService = void 0;
const db_1 = require("../../lib/db");
const file_1 = require("../../schemas/file");
const drizzle_orm_1 = require("drizzle-orm");
const category_1 = require("../../schemas/category");
const dbClient_1 = require("../../dbClient/dbClient"); // Import necessary functions
class FileService {
    // async createFile(fileData: any): Promise<any> {
    //     const result = await db.insert(files).values(fileData).returning();
    //     return result
    // } 
    async createFile(fileData) {
        const result = await (0, dbClient_1.addSingleRecord)(file_1.files, fileData);
        return result;
    }
    async checkTitleExists(title, categoryId) {
        const existingFile = await db_1.db
            .select()
            .from(file_1.files)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(file_1.files.title, title), (0, drizzle_orm_1.eq)(file_1.files.category_id, categoryId)))
            .limit(1);
        return existingFile.length > 0;
    }
    async findAll({ offset, limit, filters, sort }) {
        const query = db_1.db.select().from(file_1.files);
        if (filters) {
            query.where((0, drizzle_orm_1.sql) `${drizzle_orm_1.sql.raw(filters)}`);
        }
        if (sort) {
            query.orderBy((0, drizzle_orm_1.sql) `${drizzle_orm_1.sql.raw(sort)}`);
        }
        query.limit(limit).offset(offset);
        const data = await query.execute();
        return data;
    }
    async getCount(filters) {
        const query = db_1.db.select({ count: (0, drizzle_orm_1.sql) `COUNT(*)` }).from(file_1.files);
        if (filters) {
            query.where((0, drizzle_orm_1.sql) `${drizzle_orm_1.sql.raw(filters)}`);
        }
        const data = await query.execute();
        return data[0].count;
    }
    //getting error while adding db-abstraction.
    async findFileById(categoryId, fileId) {
        const fileData = await db_1.db
            .select()
            .from(file_1.files)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(file_1.files.id, fileId), (0, drizzle_orm_1.eq)(file_1.files.category_id, categoryId)));
        return fileData[0];
    }
    // public async findSingleFile(file_id: number) {
    //     const fileData = await db.select().from(files).where(eq (files.id,file_id)).execute();
    //     return fileData[0];
    // }
    async findSingleFile(file_id) {
        const fileData = await (0, dbClient_1.getRecordByColumn)(file_1.files, 'id', file_id);
        return fileData;
    }
    async updateFileById(categoryId, fileId, updatedData) {
        const file = await db_1.db
            .update(file_1.files)
            .set({ title: updatedData.title })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(file_1.files.id, fileId), (0, drizzle_orm_1.eq)(file_1.files.category_id, categoryId)))
            .returning();
        return file[0];
    }
    async deleteFileById(categoryId, fileId) {
        const fileData = await db_1.db.update(file_1.files)
            .set({ status: 'archieved' })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(file_1.files.id, fileId), (0, drizzle_orm_1.eq)(file_1.files.category_id, categoryId)))
            .returning();
        return fileData[0];
    }
    // deleteing ireespective of category
    async deleteNewFileById(fileId) {
        const fileData = await db_1.db.update(file_1.files)
            .set({ status: 'archieved' })
            .where((0, drizzle_orm_1.eq)(file_1.files.id, fileId))
            .returning();
        return fileData[0];
    }
    async deleteFilesByIds(category_id, ids) {
        const fileData = await db_1.db.update(file_1.files)
            .set({ status: 'archieved' })
            .where((0, drizzle_orm_1.inArray)(file_1.files.id, ids))
            .returning();
        return fileData;
    }
    // Service for fetching total storage
    async getTotalStorage(filters) {
        const totalResult = await db_1.db
            .select({
            totalStorage: (0, drizzle_orm_1.sql) `SUM(${file_1.files.size})`,
        })
            .from(file_1.files)
            .where((0, drizzle_orm_1.and)(...filters));
        return totalResult[0]?.totalStorage || 0;
    }
    // Service for fetching total number of files for the user
    async getTotalFileCount(filters) {
        const countResult = await db_1.db
            .select({
            totalFiles: (0, drizzle_orm_1.sql) `COUNT(${file_1.files.id})`
        })
            .from(file_1.files)
            .where((0, drizzle_orm_1.and)(...filters));
        return countResult[0]?.totalFiles || 0;
    }
    // Service for fetching storage breakdown per file type
    async getStorageBreakdown(filters) {
        const breakdownResult = await db_1.db
            .select({
            fileType: file_1.files.type,
            storage: (0, drizzle_orm_1.sql) `SUM(${file_1.files.size})`,
            count: (0, drizzle_orm_1.sql) `COUNT(${file_1.files.id})`
        })
            .from(file_1.files)
            .where((0, drizzle_orm_1.and)(...filters))
            .groupBy(file_1.files.type);
        return breakdownResult;
    }
    async getArchivedFilesByUser(userId) {
        const archivedFiles = await db_1.db.select()
            .from(file_1.files)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(file_1.files.uploaded_by, userId), (0, drizzle_orm_1.eq)(file_1.files.status, 'archieved')));
        return archivedFiles;
    }
    // Permanently delete archived files from the database
    async deleteArchivedFiles(archivedFiles) {
        const archivedFileIds = archivedFiles.map(file => file.id);
        const deletedFiles = await db_1.db.delete(file_1.files)
            .where((0, drizzle_orm_1.inArray)(file_1.files.id, archivedFileIds))
            .returning();
        return deletedFiles;
    }
    async updateFilesStatusToActive(archivedFiles) {
        const archivedFileIds = archivedFiles.map(file => file.id);
        const updatedFiles = await db_1.db.update(file_1.files)
            .set({ status: 'active' })
            .where((0, drizzle_orm_1.inArray)(file_1.files.id, archivedFileIds))
            .returning();
        return updatedFiles;
    }
    async findAllUserwise({ offset, limit, filters, sort }) {
        try {
            const query = db_1.db
                .select({
                file_id: file_1.files.id,
                title: file_1.files.title,
                name: file_1.files.name,
                mime_type: file_1.files.mime_type,
                size: file_1.files.size,
                path: file_1.files.path,
                uploaded_at: file_1.files.uploaded_at,
                // uploaded_by: files.uploaded_by,
                status: file_1.files.status,
                category_id: category_1.categories.id,
                category_name: category_1.categories.name,
                type: file_1.files.type,
                // tags: files.tags,
                created_at: file_1.files.created_at,
                updated_at: file_1.files.updated_at
            })
                .from(file_1.files)
                .leftJoin(category_1.categories, (0, drizzle_orm_1.eq)(file_1.files.category_id, category_1.categories.id));
            if (filters) {
                query.where((0, drizzle_orm_1.sql) `${drizzle_orm_1.sql.raw(filters)}`);
            }
            if (sort) {
                query.orderBy((0, drizzle_orm_1.sql) `${drizzle_orm_1.sql.raw(sort)}`);
            }
            query.limit(limit).offset(offset);
            const data = await query.execute();
            return data;
        }
        catch (error) {
            console.error('Service Error:', error);
            throw error;
        }
    }
}
exports.fileService = new FileService();
