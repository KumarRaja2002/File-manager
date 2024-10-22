import { db } from '../../lib/db';
import { categories } from '../../schemas/category';
import { files } from '../../schemas/file';
import { eq, sql, ne, and, ilike, count, asc } from 'drizzle-orm';
import { NewCategory, Category, CategoryTable } from '../../schemas/category';
import { addSingleRecord, deleteSingleRecord, getRecordByColumn, updateSingleRecord, getCategoryByColumn } from '../../dbClient/dbClient';
import { NewDBRecord } from '../../utils/types';

export class CategoryService {

  public async createCategory(categoryData: NewCategory) {
    const newCategory = await addSingleRecord<Category>(categories, categoryData);
    return newCategory;
  }

  public async findCategoryByName(name: string, excludeId?: number) {
    const lowerCaseName = name.trim().toLowerCase();
    return await getCategoryByColumn<Category>(categories, 'name', lowerCaseName, excludeId);
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

  public async findCategories(filters: any[]) {
    return await db
      .select({
        id: categories.id,
        name: categories.name
      })
      .from(categories)
      .where(and(...filters))  
      .orderBy(asc(categories.name)); 
}


  public async findCategoryById(id: number) {
    return await getRecordByColumn<Category>(categories, 'id', id);
  }

  public async updateCategoryById(categoryData: NewDBRecord, id: number) {
    return await updateSingleRecord(categories, categoryData, id);
  }

  public async deleteCategoryById(id: number) {

    return await db.transaction(async (trx) => {
      const categoryData = await trx.update(categories)
        .set({ status: 'archieved' })
        .where(eq(categories.id, id))
        .returning();

      await trx.update(files)
        .set({ status: 'archieved' })
        .where(eq(files.category_id, id));

      return categoryData;
    });

  }

  public async restoreCategoryById(id: number) {

    return await db.transaction(async (trx) => {
      const categoryData = await trx.update(categories)
        .set({ status: 'active' })
        .where(eq(categories.id, id))
        .returning();

      await trx.update(files)
        .set({ status: 'active' })
        .where(eq(files.category_id, id));

      return categoryData;
    });

  }





  public async findAll({ offset, limit, filters, sort }: { offset: number; limit: number; filters?: string; sort?: string }) {


    const query: any = db
      .select(
        {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          // description: categories.description,
          status: categories.status,
          files_count: count(sql`CASE WHEN ${files.status} = 'active' THEN 1 ELSE NULL END`),
          // created_by: categories.created_by,
          // updated_by: categories.updated_by,
          created_at: categories.created_at,
          updated_at: categories.updated_at
        }
      )
      .from(categories)
      .where(
        and(
          eq(categories.status, "active"),
          // eq(files.status,"active")
        )
      )
      .leftJoin(files, eq(categories.id, files.category_id))
      .groupBy(categories.id)


    if (filters) {
      query.where(sql`${sql.raw(filters)}`);
    }

    if (sort) {
      query.orderBy(sql`${sql.raw(sort)}`);
    }

    query.limit(limit).offset(offset);

    return query.execute();
  }

  async getCount(filters?: string) {
    const query = db
      .select({ count: sql<number>`COUNT(*)` })
      .from(categories);

    if (filters) {
      query.where(sql`${sql.raw(filters)}`);
    }

    const data = await query.execute();
    return data[0].count;
  }

  public async findArchieved({ offset, limit, filters, sort }: { offset: number; limit: number; filters?: string; sort?: string }) {
    const query: any = db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        status: categories.status,
        files_count: count(sql`CASE WHEN ${files.status} = 'archieved' THEN 1 ELSE NULL END`), // Count archived files
        created_by: categories.created_by,
        updated_by: categories.updated_by,
        created_at: categories.created_at,
        updated_at: categories.updated_at
      })
      .from(categories)
      .where(
        and(
          eq(categories.status, "archieved"),
          // eq(files.status, "archived")  // Archived files condition in LEFT JOIN
        )
      )
      .leftJoin(files, eq(categories.id, files.category_id))
      .groupBy(categories.id);

    if (filters) {
      query.where(sql`${sql.raw(filters)}`);
    }

    if (sort) {
      query.orderBy(sql`${sql.raw(sort)}`);
    }

    query.limit(limit).offset(offset);

    return query.execute();
  }


  public async permanentDeleteCategoryById(categoryId: number) {
    return await db.transaction(async (trx) => {


      await trx
        .delete(files)
        .where(eq(files.category_id, categoryId));

      const deletedCategory = await trx
        .delete(categories)
        .where(eq(categories.id, categoryId))
        .returning();

      return deletedCategory[0];
    });
  }




}
