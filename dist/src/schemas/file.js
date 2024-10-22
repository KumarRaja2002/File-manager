"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.files = exports.statusEnum = exports.fileTypeEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const category_1 = require("./category");
const user_1 = require("./user");
//export const fileTypeEnum = pgEnum('type', ['image', 'media', 'document', 'other']);
exports.fileTypeEnum = (0, pg_core_1.pgEnum)('type', ['document', 'image', 'media', 'other']);
exports.statusEnum = (0, pg_core_1.pgEnum)('status', ['active', 'archieved']);
exports.files = (0, pg_core_1.pgTable)('files', {
    id: (0, pg_core_1.serial)('id').primaryKey().notNull(),
    title: (0, pg_core_1.varchar)('title').notNull(),
    name: (0, pg_core_1.varchar)('name').notNull(),
    mime_type: (0, pg_core_1.varchar)('mime_type').notNull(),
    size: (0, pg_core_1.integer)('size').notNull(),
    path: (0, pg_core_1.varchar)('path').notNull(),
    uploaded_at: (0, pg_core_1.timestamp)('uploaded_at').defaultNow(),
    uploaded_by: (0, pg_core_1.integer)('uploaded_by').references(() => user_1.users.id),
    status: (0, exports.statusEnum)('status').default('active'),
    category_id: (0, pg_core_1.integer)('category_id').references(() => category_1.categories.id).notNull(),
    type: (0, exports.fileTypeEnum)('type').notNull(),
    tags: (0, pg_core_1.json)('tags').$type().default([]),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
}, (table) => {
    return {
        category_idIdx: (0, pg_core_1.index)('category_id_idx').on(table.category_id),
        typeIdx: (0, pg_core_1.index)('type_idx').on(table.type),
    };
});
