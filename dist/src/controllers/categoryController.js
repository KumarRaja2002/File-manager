"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
;
const responseHelper_1 = require("../helpers/responseHelper");
const categoryDataServiceProvider_1 = require("../services/database/categoryDataServiceProvider");
const appMessages_1 = require("../constants/appMessages");
const resourseAlreadyExistsException_1 = require("../exceptions/resourseAlreadyExistsException");
const makeSlug_1 = require("../helpers/makeSlug");
const createCategory_1 = require("../validations/categoryValidation/schemas/createCategory");
const updateCategory_1 = require("../validations/categoryValidation/schemas/updateCategory");
const validationHelper_1 = __importDefault(require("../helpers/validationHelper"));
const notFounException_1 = require("../exceptions/notFounException");
const filterHelper_1 = require("../helpers/filterHelper");
const sortHelper_1 = require("../helpers/sortHelper");
const paginationHelper_1 = __importDefault(require("../helpers/paginationHelper"));
const categoryService = new categoryDataServiceProvider_1.CategoryService();
class CategoryController {
    async create(c) {
        try {
            const categoryData = await c.req.json();
            const user = c.get('user');
            const validatedData = await (0, validationHelper_1.default)(createCategory_1.createCategorySchema, categoryData);
            const originalName = validatedData.name.trim();
            const nameToCheck = originalName.toLowerCase();
            const existedCategory = await categoryService.findCategoryByName(nameToCheck);
            if (existedCategory && existedCategory.status == 'active') {
                throw new resourseAlreadyExistsException_1.ResourceAlreadyExistsException("name", appMessages_1.CATEGORY_EXISTS);
            }
            if (!validatedData.slug) {
                const timestamp = Date.now();
                validatedData.slug = (0, makeSlug_1.makeSlug)(originalName, timestamp);
            }
            validatedData.name = originalName;
            validatedData.created_by = user.id;
            validatedData.updated_by = user.id;
            const newCategory = await categoryService.createCategory(validatedData);
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, appMessages_1.CATEGORIES_CREATED, newCategory);
        }
        catch (error) {
            throw error;
        }
    }
    async getOne(c) {
        try {
            const categoryId = +c.req.param('id');
            const categoryData = await categoryService.findCategoryById(categoryId);
            if (!categoryData) {
                throw new notFounException_1.NotFoundException(appMessages_1.CATEGORY_NOT_FOUND);
            }
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, appMessages_1.CATEGORY_FOUND, categoryData);
        }
        catch (error) {
            throw error;
        }
    }
    //REVIEW:Remove consoles
    async update(c) {
        try {
            const categoryId = +c.req.param('id');
            const categoryData = await c.req.json();
            const user = c.get('user');
            const validatedData = await (0, validationHelper_1.default)(updateCategory_1.updateCategorySchema, categoryData);
            const originalName = validatedData.name.trim();
            const nameToCheck = originalName.toLowerCase();
            const category = await categoryService.findCategoryById(categoryId);
            if (!category) {
                throw new notFounException_1.NotFoundException(appMessages_1.CATEGORY_NOT_FOUND);
            }
            if (category.status === 'archieved') {
                throw new resourseAlreadyExistsException_1.ResourceAlreadyExistsException("Category", appMessages_1.CANT_UPDATE);
            }
            const existedCategory = await categoryService.findCategoryByName(nameToCheck, categoryId);
            if (existedCategory && existedCategory.status == 'active') {
                throw new resourseAlreadyExistsException_1.ResourceAlreadyExistsException("name", appMessages_1.CATEGORY_EXISTS);
            }
            if (!validatedData.slug) {
                const timestamp = Date.now();
                validatedData.slug = (0, makeSlug_1.makeSlug)(validatedData.name, timestamp);
            }
            validatedData.name = originalName;
            validatedData.created_by = user.id;
            validatedData.updated_by = user.id;
            const updatedCategory = await categoryService.updateCategoryById(validatedData, categoryId);
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, appMessages_1.CATEGORY_UPDATED, updatedCategory);
        }
        catch (error) {
            throw error;
        }
    }
    async delete(c) {
        try {
            const categoryId = +c.req.param('id');
            const categoryData = await categoryService.findCategoryById(categoryId);
            if (!categoryData) {
                throw new notFounException_1.NotFoundException(appMessages_1.CATEGORY_NOT_FOUND);
            }
            const updatedData = await categoryService.deleteCategoryById(categoryId);
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, appMessages_1.CATEGORY_ARCHIVED, updatedData);
        }
        catch (error) {
            throw error;
        }
    }
    async getAllCategories(c) {
        try {
            const query = c.req.query();
            const user = c.get('user');
            const page = parseInt(query.page || '1', 10);
            const limit = parseInt(query.limit || '10', 10);
            const skip = (page - 1) * limit;
            query.created_by = user.id;
            const filters = filterHelper_1.filterHelper.categoriesFilter(query);
            const sort = sortHelper_1.sortHelper.sort(query);
            const [categories, totalCount] = await Promise.all([
                categoryService.findAll({ offset: skip, limit, filters, sort }),
                categoryService.getCount(filters),
            ]);
            const paginationData = paginationHelper_1.default.getPaginationResponse({
                page,
                count: totalCount,
                limit,
                skip,
                data: categories,
                message: appMessages_1.CATEGORY_FETCHED,
                searchString: query.search_string
            });
            return c.json(paginationData);
        }
        catch (error) {
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
    async getCategories(c) {
        try {
            const query = c.req.query();
            const user = c.get('user');
            const filters = filterHelper_1.filterHelper.categoriesNameSearchFilter({ ...query, created_by: user.id });
            const categories = await categoryService.findCategories(filters);
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, 'Categories retrieved successfully', categories);
        }
        catch (error) {
            console.error('Error fetching categories', error);
            return responseHelper_1.ResponseHelper.sendErrorResponse(c, 500, 'Error fetching categories');
        }
    }
    async getArchivedCategories(c) {
        try {
            const query = c.req.query();
            const user = c.get('user');
            const page = parseInt(query.page || '1', 10);
            const limit = parseInt(query.limit || '10', 10);
            const skip = (page - 1) * limit;
            query.created_by = user.id;
            const filters = filterHelper_1.filterHelper.archievedCategoriesFilter(query);
            const sort = sortHelper_1.sortHelper.sort(query);
            const [categories, totalCount] = await Promise.all([
                categoryService.findArchieved({ offset: skip, limit, filters, sort }),
                categoryService.getCount(filters),
            ]);
            const paginationData = paginationHelper_1.default.getPaginationResponse({
                page,
                count: totalCount,
                limit,
                skip,
                data: categories,
                message: 'Archieved Categories Fetched',
                searchString: query.search_string,
            });
            return c.json(paginationData);
        }
        catch (error) {
            throw error;
        }
    }
    async restoreCategory(c) {
        try {
            const categoryId = +c.req.param('id');
            const categoryData = await categoryService.findCategoryById(categoryId);
            if (!categoryData) {
                throw new notFounException_1.NotFoundException(appMessages_1.CATEGORY_NOT_FOUND);
            }
            const updatedData = await categoryService.restoreCategoryById(categoryId);
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, appMessages_1.CATEGORY_RESTORED, updatedData);
        }
        catch (error) {
            throw error;
        }
    }
    async permenantDelete(c) {
        try {
            const categoryId = +c.req.param('id');
            const categoryData = await categoryService.findCategoryById(categoryId);
            if (!categoryData) {
                throw new notFounException_1.NotFoundException(appMessages_1.CATEGORY_NOT_FOUND);
            }
            const updatedData = await categoryService.permanentDeleteCategoryById(categoryId);
            return responseHelper_1.ResponseHelper.sendSuccessResponse(c, 200, appMessages_1.CATEGORY_DELETED, updatedData);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.CategoryController = CategoryController;
