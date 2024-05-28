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
exports.OffersService = void 0;
const offers_repository_1 = require("../repositories/offers.repository");
const common_1 = require("@nestjs/common");
let OffersService = class OffersService {
    constructor(repository) {
        this.repository = repository;
    }
    findAll(filter, options) {
        return this.repository.findAll(filter, options);
    }
};
OffersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [offers_repository_1.OffersRepository])
], OffersService);
exports.OffersService = OffersService;
//# sourceMappingURL=offers.service.js.map