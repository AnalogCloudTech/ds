"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsFilterBuilder = void 0;
const qs_1 = require("qs");
const lodash_1 = require("lodash");
const FILTER_FIELD_NAME = 'filters';
var Operators;
(function (Operators) {
    Operators["$eq"] = "$eq";
    Operators["$ne"] = "$ne";
    Operators["$lt"] = "$lt";
    Operators["$lte"] = "$lte";
    Operators["$gt"] = "$gt";
    Operators["$gte"] = "$gte";
    Operators["$in"] = "$in";
    Operators["$notIn"] = "$notIn";
    Operators["$contains"] = "$contains";
    Operators["$notContains"] = "$notContains";
    Operators["$containsi"] = "$containsi";
    Operators["$notContainsi"] = "$notContainsi";
    Operators["$null"] = "$null";
    Operators["$notNull"] = "$notNull";
    Operators["$between"] = "$between";
    Operators["$startsWith"] = "$startsWith";
    Operators["$endsWith"] = "$endsWith";
    Operators["$or"] = "$or";
    Operators["$and"] = "$and";
})(Operators || (Operators = {}));
class CmsFilterBuilder {
    static build(filters) {
        const httpFilterQueryString = filters.map((filter) => {
            const { name, operator, value } = filter;
            const url = [];
            if (operator === '$in') {
                (0, lodash_1.each)(value, (item, key) => {
                    url.push(`${FILTER_FIELD_NAME}[${name}][${operator}][${key}]=${item}`);
                });
            }
            else {
                url.push(`${FILTER_FIELD_NAME}[${name}][${operator}]=${value}`);
            }
            return url.join('&');
        });
        return httpFilterQueryString.join('&');
    }
    static buildSubQuery(query) {
        const { operator, value } = query;
        const filterArr = value.map((filter) => {
            const { name, operator, value } = filter;
            return { [name]: { [operator]: value } };
        });
        return (0, qs_1.stringify)({ [FILTER_FIELD_NAME]: { [operator]: filterArr } });
    }
}
exports.CmsFilterBuilder = CmsFilterBuilder;
//# sourceMappingURL=cms.filter.builder.js.map