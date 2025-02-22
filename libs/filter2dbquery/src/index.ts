import { forIn, isEmpty, split, trim } from 'lodash';

/**
 * This function return object built from filter query string.
 * The object can be used to fetch requested resources according
 * to filter query.
 * This function considers filter query string will be in the
 * form mentioned in the link
 * https://github.com/Microsoft/api-guidelines/blob/vNext/Guidelines.md#97-filtering
 *
 * Example -- $filter=name eq 'Milk' and price lt 2.55
 * Input to the function - name eq 'Milk' and price lt 2.55
 * output from this function -
 * {
 *     and : {
 *              name: { eq : Milk },
 *              price: { lt: 2.55 }
 *            }
 * }
 * @param queryData - filter query string
 */
const parseFilterQuery = function (queryData = '') {
  let result = {};
  const logicalOperator = allowedLogicalOperators.find((operator) => {
    return queryData.includes(operator);
  });
  if (logicalOperator) {
    const filters = split(queryData, logicalOperator);
    const expressions = prepareComparisonObject(filters, true);
    result = prepareMongoDbQueryForLogicalOperators(
      logicalOperator,
      expressions,
    );
  } else {
    Object.assign(result, prepareComparisonObject([queryData], false));
  }
  return result;
};

const prepareComparisonObject = function (filters, isLogicalOperatorPresent) {
  const resultObj = {};
  const resultArray = [];

  if (!isEmpty(filters)) {
    filters.forEach((filter) => {
      const operator = allowedComparisonOperators.find((comparisonOperator) => {
        return filter.includes(comparisonOperator);
      });
      if (operator) {
        const tempObj = {};
        const filterParams = split(filter, operator);
        tempObj[filterParams[0]] = {};
        const key = getMongoDbQueryOperator(operator);
        tempObj[filterParams[0]][key] = trim(filterParams[1], `'"`);
        if (isLogicalOperatorPresent) {
          resultArray.push(tempObj);
        } else {
          Object.assign(resultObj, tempObj);
        }
      }
    });
  }
  return isLogicalOperatorPresent ? resultArray : resultObj;
};

/**
 * Returns respective mongoDb query operator. Please refer following url for mongoDb query operators.
 * MongoDb comparison operators - https://docs.mongodb.com/manual/reference/operator/query-comparison/.
 * MongoDb logical operators - https://docs.mongodb.com/manual/reference/operator/query-logical/.
 *
 * @param operator - respective mongoDb query operator.
 */
const getMongoDbQueryOperator = function (operator) {
  let result;
  switch (trim(operator)) {
    case 'ge':
      result = `$gte`;
      break;
    case 'le':
      result = `$lte`;
      break;
    default:
      result = `$${trim(operator)}`;
      break;
  }
  return result;
};

const prepareMongoDbQueryForLogicalOperators = function (
  operator,
  expressions,
) {
  const result = {};
  switch (trim(operator)) {
    case 'not':
      forIn(expressions[0], (value, key) => {
        result[key] = { $not: value };
      });
      break;
    default:
      result[`$${trim(operator)}`] = expressions;
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

export default {
  parseFilterQuery,
};
