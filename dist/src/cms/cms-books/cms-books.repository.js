"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsBooksRepository = void 0;
const luxon_1 = require("luxon");
const common_1 = require("@nestjs/common");
const contexts_1 = require("../../internal/common/contexts");
class CmsBooksRepository {
    constructor(http, logger) {
        this.http = http;
        this.logger = logger;
        this.baseRoute = 'books';
    }
    async findAll() {
        try {
            const { data } = await this.http.get(this.baseRoute);
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                const payload = {
                    usageDate: luxon_1.DateTime.now(),
                    error: error === null || error === void 0 ? void 0 : error.message,
                    message: 'Unable to fetch books from CMS',
                    method: 'CmsBooksRepository@findAll',
                };
                this.logger.error({ payload }, '', contexts_1.CONTEXT_CMS_BOOK_ERROR);
                throw new common_1.HttpException(payload, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}
exports.CmsBooksRepository = CmsBooksRepository;
//# sourceMappingURL=cms-books.repository.js.map