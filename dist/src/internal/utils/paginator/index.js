"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatorTransformPipe = exports.PaginatorSchema = exports.Paginator = void 0;
const paginator_1 = require("./paginator");
exports.Paginator = paginator_1.default;
const paginator_schema_1 = require("./paginator.schema");
Object.defineProperty(exports, "PaginatorSchema", { enumerable: true, get: function () { return paginator_schema_1.PaginatorSchema; } });
const paginator_transform_pipe_1 = require("./paginator.transform.pipe");
exports.PaginatorTransformPipe = paginator_transform_pipe_1.default;
//# sourceMappingURL=index.js.map