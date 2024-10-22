"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categories = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const user_1 = require("./user");
exports.categories = (0, pg_core_1.pgTable)('categories', {
    id: (0, pg_core_1.serial)('id').primaryKey().notNull(),
    name: (0, pg_core_1.varchar)('name').notNull(),
    slug: (0, pg_core_1.varchar)('slug').unique().notNull(),
    description: (0, pg_core_1.text)('description'),
    created_by: (0, pg_core_1.integer)('created_by').references(() => user_1.users.id),
    updated_by: (0, pg_core_1.integer)('updated_by').references(() => user_1.users.id),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
}, (table) => {
    return {
        slugIdx: (0, pg_core_1.uniqueIndex)('slug_idx').on(table.slug),
        nameIdx: (0, pg_core_1.index)('name_idx').on(table.name),
    };
});
