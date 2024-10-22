"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.serial)('id').primaryKey().notNull(),
    full_name: (0, pg_core_1.varchar)('full_name').notNull(),
    email: (0, pg_core_1.varchar)('email').notNull(),
    phone: (0, pg_core_1.varchar)('phone'),
    password: (0, pg_core_1.varchar)('password').notNull(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
}, (table) => {
    return {
        emailIdx: (0, pg_core_1.uniqueIndex)('email_idx').on(table.email),
    };
});
