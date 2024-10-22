"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PaginationHelper {
    getTotalNumberOfPages(count, limit) {
        let totalPages = 0;
        if (count) {
            totalPages = (limit && Math.ceil(count / limit)) || 1;
        }
        return totalPages;
    }
    getHasMore(skip, dataLength, count) {
        let hasMore = false;
        if (skip !== undefined && skip !== null) {
            hasMore = (skip + dataLength) < count;
        }
        return hasMore;
    }
    getPaginationResponse({ page = 1, count = 0, limit = 10, skip = 0, data = [], data_field = 'data', message = '', searchString = '' }) {
        const hasMore = this.getHasMore(skip, data.length, count);
        const totalPages = this.getTotalNumberOfPages(count, limit);
        page = Number(page);
        return {
            has_more: hasMore,
            total: count,
            page,
            limit: limit || 0,
            total_pages: totalPages,
            success: true,
            status: 200,
            message,
            search_string: searchString,
            [data_field]: data
        };
    }
}
exports.default = new PaginationHelper();
