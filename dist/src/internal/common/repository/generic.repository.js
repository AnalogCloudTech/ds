"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericRepository = void 0;
const paginator_1 = require("../../utils/paginator");
class GenericRepository {
    constructor(model) {
        this.model = model;
    }
    async delete(id) {
        return this.model.findByIdAndDelete(id).exec();
    }
    async findAll(query, options = { sort: { credits: 'asc' } }, projection) {
        return this.model.find(query, projection, options).exec();
    }
    async findAllPaginated(query, options = {
        skip: 0,
        limit: 10,
        lean: true,
    }, projection) {
        var _a, _b;
        const [total, data] = await Promise.all([
            this.model.countDocuments(query).exec(),
            this.model.find(query, projection, options).exec(),
        ]);
        const page = (_a = options.skip / options.limit) !== null && _a !== void 0 ? _a : 0;
        return paginator_1.PaginatorSchema.build(total, data, page, (_b = options.limit) !== null && _b !== void 0 ? _b : 10);
    }
    async findById(id, options) {
        return this.model.findById(id, {}, options).exec();
    }
    async store(data) {
        return this.model.create(data);
    }
    async first(query) {
        return this.model.findOne(query).exec();
    }
    async update(id, data) {
        return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    }
    async count(filter) {
        return this.model.countDocuments(filter);
    }
}
exports.GenericRepository = GenericRepository;
//# sourceMappingURL=generic.repository.js.map