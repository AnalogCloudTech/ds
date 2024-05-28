"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterableService = void 0;
const filter2dbquery_1 = require("../../../../libs/filter2dbquery/src");
const { parseFilterQuery } = filter2dbquery_1.default;
class FilterableService {
    search(filter) {
        const parsedFilter = parseFilterQuery(filter);
        return this.getFilterableModel().find(parsedFilter).exec();
    }
}
exports.FilterableService = FilterableService;
//# sourceMappingURL=filterable.service.js.map