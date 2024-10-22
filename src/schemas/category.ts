import { pgTable, serial, text, timestamp, integer, varchar, index, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './user';

export const statusEnum = pgEnum('status', ['active', 'archieved']);

export const categories = pgTable('categories', {
  id: serial('id').primaryKey().notNull(), 
  
  name: varchar('name').notNull(), 
  slug: varchar('slug').unique().notNull(),
  description: text('description'),
  status: statusEnum('status').default('active'),

  created_by: integer('created_by').references(() => users.id), 
  updated_by: integer('updated_by').references(() => users.id),
  
  created_at: timestamp('created_at').defaultNow().notNull(), 
  updated_at: timestamp('updated_at').defaultNow().notNull(), 
},
(table) => {
  return {
    slugIdx: uniqueIndex('slug_idx').on(table.slug),
    nameIdx: index('name_idx').on(table.name),
  };
});

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type CategoryTable = typeof categories