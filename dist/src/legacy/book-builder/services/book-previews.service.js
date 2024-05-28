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
exports.BookPreviewsService = void 0;
const book_previews_respository_1 = require("../repositories/book-previews.respository");
const common_1 = require("@nestjs/common");
let BookPreviewsService = class BookPreviewsService {
    constructor(bookPreviewsRepository) {
        this.bookPreviewsRepository = bookPreviewsRepository;
    }
    create(dto) {
        return this.bookPreviewsRepository.store(dto);
    }
    find(filter, options = {}) {
        return this.bookPreviewsRepository.findAllPaginated(filter, options);
    }
    delete(id) {
        return this.bookPreviewsRepository.delete(id);
    }
    update(id, dto) {
        return this.bookPreviewsRepository.update(id, dto);
    }
};
BookPreviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [book_previews_respository_1.BookPreviewsRepository])
], BookPreviewsService);
exports.BookPreviewsService = BookPreviewsService;
//# sourceMappingURL=book-previews.service.js.map