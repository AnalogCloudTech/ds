"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericRepository = void 0;
const common_1 = require("@nestjs/common");
const cms_populate_builder_1 = require("../../../internal/utils/cms/populate/cms.populate.builder");
class GenericRepository {
    constructor(http) {
        this.http = http;
    }
    delete(id) {
        return Promise.resolve({});
    }
    async findAllPaginated(query) {
        const queryString = cms_populate_builder_1.CmsPopulateBuilder.build(query);
        const { data } = await this.http.get(`${this.baseRoute}?${queryString}`);
        return data;
    }
    async findById(id) {
        const { status, data } = await this.http.get(`${this.baseRoute}/${id}`);
        return status === common_1.HttpStatus.OK ? data.data : null;
    }
    async first(query) {
        const queryString = cms_populate_builder_1.CmsPopulateBuilder.build(query);
        const { status, data } = await this.http.get(`${this.baseRoute}?${queryString}`);
        return status === common_1.HttpStatus.OK && data.data.length > 0
            ? data.data[0]
            : null;
    }
    store(data) {
        return Promise.resolve({});
    }
    update(id, data) {
        return Promise.resolve({});
    }
}
exports.GenericRepository = GenericRepository;
//# sourceMappingURL=generic.repository.js.map