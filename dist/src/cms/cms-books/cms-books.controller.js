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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsBooksController = void 0;
const common_1 = require("@nestjs/common");
const cms_books_service_1 = require("./cms-books.service");
const cms_book_1 = require("./domain/cms-book");
const serialize_interceptor_1 = require("../../internal/common/interceptors/serialize.interceptor");
let CmsBooksController = class CmsBooksController {
    constructor(cmsBooksService) {
        this.cmsBooksService = cmsBooksService;
    }
    async list() {
        return this.cmsBooksService.findAll();
    }
};
__decorate([
    (0, serialize_interceptor_1.Serialize)(cms_book_1.CmsBookDomain),
    (0, common_1.Get)('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CmsBooksController.prototype, "list", null);
CmsBooksController = __decorate([
    (0, common_1.Controller)({
        version: '1',
        path: 'cms-books',
    }),
    __metadata("design:paramtypes", [cms_books_service_1.CmsBooksService])
], CmsBooksController);
exports.CmsBooksController = CmsBooksController;
//# sourceMappingURL=cms-books.controller.js.map