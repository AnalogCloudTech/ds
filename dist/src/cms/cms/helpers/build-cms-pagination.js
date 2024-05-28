"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCmsPagination = void 0;
const paginator_1 = require("../../../internal/utils/paginator");
const lodash_1 = require("lodash");
const flatten_cms_object_1 = require("./flatten-cms-object");
function buildCmsPagination(response) {
    const { data, meta } = response;
    const list = data.map((item) => (0, flatten_cms_object_1.flattenCmsObject)(item));
    const total = (0, lodash_1.get)(meta, ['pagination', 'total'], 0);
    const perPage = (0, lodash_1.get)(meta, ['pagination', 'pageSize'], 15);
    const currentPage = (0, lodash_1.get)(meta, ['pagination', 'page'], 1) - 1;
    return paginator_1.PaginatorSchema.build(total, list, currentPage, perPage);
}
exports.buildCmsPagination = buildCmsPagination;
//# sourceMappingURL=build-cms-pagination.js.map