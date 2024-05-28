"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const parseFilterQuery = function (queryData = '') {
    let result = {};
    const logicalOperator = allowedLogicalOperators.find((operator) => {
        return queryData.includes(operator);
    });
    if (logicalOperator) {
        const filters = (0, lodash_1.split)(queryData, logicalOperator);
        const expressions = prepareComparisonObject(filters, true);
        result = prepareMongoDbQueryForLogicalOperators(logicalOperator, expressions);
    }
    else {
        Object.assign(result, prepareComparisonObject([queryData], false));
    }
    return result;
};
const prepareComparisonObject = function (filters, isLogicalOperatorPresent) {
    const resultObj = {};
    const resultArray = [];
    if (!(0, lodash_1.isEmpty)(filters)) {
        filters.forEach((filter) => {
            const operator = allowedComparisonOperators.find((comparisonOperator) => {
                return filter.includes(comparisonOperator);
            });
            if (operator) {
                const tempObj = {};
                const filterParams = (0, lodash_1.split)(filter, operator);
                tempObj[filterParams[0]] = {};
                const key = getMongoDbQueryOperator(operator);
                tempObj[filterParams[0]][key] = (0, lodash_1.trim)(filterParams[1], `'"`);
                if (isLogicalOperatorPresent) {
                    resultArray.push(tempObj);
                }
                else {
                    Object.assign(resultObj, tempObj);
                }
            }
        });
    }
    return isLogicalOperatorPresent ? resultArray : resultObj;
};
const getMongoDbQueryOperator = function (operator) {
    let result;
    switch ((0, lodash_1.trim)(operator)) {
        case 'ge':
            result = `$gte`;
            break;
        case 'le':
            result = `$lte`;
            break;
        default:
            result = `$${(0, lodash_1.trim)(operator)}`;
            break;
    }
    return result;
};
const prepareMongoDbQueryForLogicalOperators = function (operator, expressions) {
    const result = {};
    switch ((0, lodash_1.trim)(operator)) {
        case 'not':
            (0, lodash_1.forIn)(expressions[0], (value, key) => {
                result[key] = { $not: value };
            });
            break;
        default:
            result[`$${(0, lodash_1.trim)(operator)}`] = expressions;
            break;
    }
    return result;
};
const allowedComparisonOperators = [
    ' eq ',
    ' ne ',
    ' gt ',
    ' ge ',
    ' lt ',
    ' le ',
];
const allowedLogicalOperators = [' and ', ' or ', 'not '];
exports.default = {
    parseFilterQuery,
};
//# sourceMappingURL=index.js.map