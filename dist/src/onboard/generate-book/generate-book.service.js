"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateBookService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let GenerateBookService = class GenerateBookService {
    constructor(http) {
        this.http = http;
    }
    async generateBook(generateBookDto) {
        const response = await this.http.post('/onboarding/generate-book', generateBookDto);
        const { data } = response;
        return data;
    }
    async getStatus(draftId) {
        const response = await this.http.get(`/onboarding/${draftId}/status`);
        const { data } = response;
        return data;
    }
    async healthCheck() {
        const response = await this.http.get('/health');
        return response.data;
    }
};
GenerateBookService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('HTTP_GENERATE_BOOK')),
    __metadata("design:paramtypes", [axios_1.Axios])
], GenerateBookService);
exports.GenerateBookService = GenerateBookService;
//# sourceMappingURL=generate-book.service.js.map