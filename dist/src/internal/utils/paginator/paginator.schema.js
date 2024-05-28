"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatorSchema = void 0;
class PaginatorSchema {
    static build(total, data, page, perPage) {
        const lastPage = Math.ceil(total / perPage);
        return {
            data,
            meta: {
                total,
                perPage,
                currentPage: page,
                lastPage,
            },
        };
    }
    static buildResult(total, data, page, perPage) {
        const lastPage = Math.ceil(total / perPage);
        return {
            data,
            meta: {
                total,
                perPage,
                currentPage: page,
                lastPage,
            },
        };
    }
}
exports.PaginatorSchema = PaginatorSchema;
//# sourceMappingURL=paginator.schema.js.map