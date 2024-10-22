import { pgTable, serial, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey().notNull(),
  
  full_name: varchar('full_name').notNull(), 
  email: varchar('email').notNull(),
  phone: varchar('phone'),
  password: varchar('password').notNull(),
  
  created_at: timestamp('created_at').defaultNow(), 
  updated_at: timestamp('updated_at').defaultNow(), 
},(table) => {
  return {
    emailIdx: uniqueIndex('email_idx').on(table.email),
  };
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserTable = typeof users;