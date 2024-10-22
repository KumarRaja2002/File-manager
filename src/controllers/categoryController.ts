import { Context } from 'hono';;
import { ResponseHelper } from '../helpers/responseHelper';
import { CategoryService } from '../services/database/categoryDataServiceProvider';
import { CATEGORIES_CREATED, CATEGORY_NOT_FOUND, CATEGORY_RESTORED, CATEGORY_ARCHIVED, CATEGORY_FETCHED, CATEGORY_UPDATED, CATEGORY_DELETED, CATEGORY_EXISTS, CANT_UPDATE, CATEGORY_FOUND, CATEGORIES_RETRIVED } from '../constants/appMessages';
import { ResourceAlreadyExistsException } from '../exceptions/resourseAlreadyExistsException';
import { makeSlug } from '../helpers/makeSlug';
import { createCategorySchema, createCategoryDataInput } from "../validations/categoryValidation/schemas/createCategory";
import { updateCategorySchema, updateCategoryDataInput } from '../validations/categoryValidation/schemas/updateCategory';
import validate from "../helpers/validationHelper";
import { NotFoundException } from '../exceptions/notFounException';
import { filterHelper } from '../helpers/filterHelper';
import { sortHelper } from '../helpers/sortHelper';
import PaginationHelper from '../helpers/paginationHelper';
const categoryService = new CategoryService()

export class CategoryController {

    public async create(c: Context) {
        try {
            const categoryData = await c.req.json();
            const user = c.get('user');
            const validatedData = await validate(createCategorySchema, categoryData);
            const originalName = validatedData.name.trim();
            const nameToCheck = originalName.toLowerCase();
            const existedCategory: any = await categoryService.findCategoryByName(nameToCheck);

            if (existedCategory && existedCategory.status == 'active') {
                throw new ResourceAlreadyExistsException("name", CATEGORY_EXISTS);
            }
            if (!validatedData.slug) {
                const timestamp = Date.now();
                validatedData.slug = makeSlug(originalName, timestamp);
            }

            validatedData.name = originalName;
            validatedData.created_by = user.id;
            validatedData.updated_by = user.id;

            const newCategory = await categoryService.createCategory(validatedData);

            return ResponseHelper.sendSuccessResponse(c, 200, CATEGORIES_CREATED, newCategory);

        } catch (error: any) {
            throw error;
        }
    }

    public async getOne(c: Context) {
        try {
            const categoryId = +c.req.param('id');
            const categoryData: any = await categoryService.findCategoryById(categoryId);
            if (!categoryData) {
                throw new NotFoundException(CATEGORY_NOT_FOUND);
            }

            return ResponseHelper.sendSuccessResponse(c, 200, CATEGORY_FOUND, categoryData);
        } catch (error) {
            throw error;
        }
    }

    //REVIEW:Remove consoles
    public async update(c: Context) {
        try {
            const categoryId = +c.req.param('id');
            const categoryData = await c.req.json();
            const user = c.get('user');

            const validatedData = await validate(updateCategorySchema, categoryData)
            const originalName = validatedData.name.trim();
            const nameToCheck = originalName.toLowerCase();


            const category = await categoryService.findCategoryById(categoryId);
            if (!category) {
                throw new NotFoundException(CATEGORY_NOT_FOUND);
            }
            if (category.status === 'archieved') {
                throw new ResourceAlreadyExistsException("Category", CANT_UPDATE);
            }
            const existedCategory: any = await categoryService.findCategoryByName(nameToCheck, categoryId);
            if (existedCategory && existedCategory.status == 'active') {
                throw new ResourceAlreadyExistsException("name", CATEGORY_EXISTS);
            }

            if (!validatedData.slug) {
                const timestamp = Date.now();
                validatedData.slug = makeSlug(validatedData.name, timestamp);
            }

            validatedData.name = originalName;
            validatedData.created_by = user.id;
            validatedData.updated_by = user.id;

            const updatedCategory = await categoryService.updateCategoryById(validatedData, categoryId);

            return ResponseHelper.sendSuccessResponse(c, 200, CATEGORY_UPDATED, updatedCategory);
        } catch (error: any) {
            throw error;
        }
    }

    public async delete(c: Context) {
        try {
            const categoryId = +c.req.param('id');
            const categoryData = await categoryService.findCategoryById(categoryId);
            if (!categoryData) {
                throw new NotFoundException(CATEGORY_NOT_FOUND);
            }

            const updatedData = await categoryService.deleteCategoryById(categoryId);

            return ResponseHelper.sendSuccessResponse(c, 200, CATEGORY_ARCHIVED, updatedData);
        } catch (error) {
            throw error;
        }
    }
    public async getAllCategories(c: Context) {
        try {
            const query = c.req.query();
            const user = c.get('user');
            const page = parseInt(query.page || '1', 10);
            const limit = parseInt(query.limit || '10', 10);

            const skip = (page - 1) * limit;
            query.created_by = user.id;
            const filters = filterHelper.categoriesFilter(query);
            const sort = sortHelper.sort(query);
            const [categories, totalCount]: any = await Promise.all([
                categoryService.findAll({ offset: skip, limit, filters, sort }),
                categoryService.getCount(filters),
            ]);

            const paginationData = PaginationHelper.getPaginationResponse({
                page,
                count: totalCount,
                limit,
                skip,
                data: categories,
                message: CATEGORY_FETCHED,
                searchString: query.search_string

            });
            return c.json(paginationData);

        } catch (error) {
            throw error;
        }
    }

    // public async getCategories(c: Context) {
    //     try {
    //         const user = c.get('user');

    //         const categories = await categoryService.findCategories(user.id);
    //         return ResponseHelper.sendSuccessResponse(c, 200, CATEGORIES_RETRIVED, categories);

    //     } catch (error) {
    //         console.error('Error fetching categories', error);
    //         return ResponseHelper.sendErrorResponse(c, 500, 'Error fetching categories');
    //     }
    // }

    public async getCategories(c: Context) {
        try {
            const query = c.req.query();
            const user = c.get('user');
            const filters = filterHelper.categoriesNameSearchFilter({ ...query, created_by: user.id });
    
            const categories = await categoryService.findCategories(filters);
            return ResponseHelper.sendSuccessResponse(c, 200, 'Categories retrieved successfully', categories);
        } catch (error) {
            console.error('Error fetching categories', error);
            return ResponseHelper.sendErrorResponse(c, 500, 'Error fetching categories');
        }
    }
    

    public async getArchivedCategories(c: Context) {
        try {
            const query = c.req.query();
            const user = c.get('user');
            const page = parseInt(query.page || '1', 10);
            const limit = parseInt(query.limit || '10', 10);

            const skip = (page - 1) * limit;
            query.created_by = user.id;

            const filters = filterHelper.archievedCategoriesFilter(query);
            const sort = sortHelper.sort(query);

            const [categories, totalCount]: any = await Promise.all([
                categoryService.findArchieved({ offset: skip, limit, filters, sort }),
                categoryService.getCount(filters),
            ]);

            const paginationData = PaginationHelper.getPaginationResponse({
                page,
                count: totalCount,
                limit,
                skip,
                data: categories,
                message: 'Archieved Categories Fetched',
                searchString: query.search_string,
            });

            return c.json(paginationData);
        } catch (error) {
            throw error;
        }
    }

    public async restoreCategory(c: Context) {
        try {
            const categoryId = +c.req.param('id');
            const categoryData = await categoryService.findCategoryById(categoryId);
            if (!categoryData) {
                throw new NotFoundException(CATEGORY_NOT_FOUND);
            }

            const updatedData = await categoryService.restoreCategoryById(categoryId);

            return ResponseHelper.sendSuccessResponse(c, 200, CATEGORY_RESTORED, updatedData);
        } catch (error) {
            throw error;
        }
    }

    public async permenantDelete(c: Context) {
        try {
            const categoryId = +c.req.param('id');
            const categoryData = await categoryService.findCategoryById(categoryId);
            if (!categoryData) {
                throw new NotFoundException(CATEGORY_NOT_FOUND);
            }
            const updatedData = await categoryService.permanentDeleteCategoryById(categoryId);

            return ResponseHelper.sendSuccessResponse(c, 200, CATEGORY_DELETED, updatedData);
        } catch (error) {
            throw error;
        }
    }

}