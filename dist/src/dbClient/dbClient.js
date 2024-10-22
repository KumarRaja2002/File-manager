"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryByColumn = exports.deleteSingleRecord = exports.updateSingleRecord = exports.getRecordByColumn = exports.addSingleRecord = void 0;
const db_1 = require("../lib/db");
const drizzle_orm_1 = require("drizzle-orm");
const addSingleRecord = async (tableName, data) => {
    const responseData = await db_1.db.insert(tableName).values(data).returning();
    return responseData[0];
};
exports.addSingleRecord = addSingleRecord;
const getRecordByColumn = async (tableName, column, value) => {
    const columnInfo = drizzle_orm_1.sql.raw(`${(0, drizzle_orm_1.getTableName)(tableName)}.${column}`);
    const userData = await db_1.db.select().from(tableName).where((0, drizzle_orm_1.eq)(columnInfo, value));
    return userData[0];
};
exports.getRecordByColumn = getRecordByColumn;
const getCategoryByColumn = async (tableName, column, value, excludeId) => {
    const columnInfo = (0, drizzle_orm_1.sql) `LOWER(${drizzle_orm_1.sql.raw(`${(0, drizzle_orm_1.getTableName)(tableName)}.${column}`)})`;
    const statusInfo = drizzle_orm_1.sql.raw(`${(0, drizzle_orm_1.getTableName)(tableName)}.status`);
    let query = db_1.db.select().from(tableName).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(columnInfo, value), (0, drizzle_orm_1.eq)(statusInfo, 'active')));
    if (excludeId !== undefined) {
        const idInfo = drizzle_orm_1.sql.raw(`${(0, drizzle_orm_1.getTableName)(tableName)}.id`);
        query = query.where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(columnInfo, value), (0, drizzle_orm_1.eq)(statusInfo, 'active'), (0, drizzle_orm_1.ne)(idInfo, excludeId)));
    }
    const categoryData = await query;
    return categoryData[0];
};
exports.getCategoryByColumn = getCategoryByColumn;
const updateSingleRecord = async (tableName, data, id) => {
    const responseData = await db_1.db
        .update(tableName)
        .set(data)
        .where((0, drizzle_orm_1.eq)(tableName.id, id))
        .returning();
    return responseData[0];
};
exports.updateSingleRecord = updateSingleRecord;
const deleteSingleRecord = async (tableName, id) => {
    return await db_1.db.delete(tableName).where((0, drizzle_orm_1.eq)(tableName.id, id));
};
exports.deleteSingleRecord = deleteSingleRecord;
