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
exports.CanBeChangedPipe = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../services");
const types_1 = require("../domain/types");
let CanBeChangedPipe = class CanBeChangedPipe {
    constructor(campaignsService) {
        this.campaignsService = campaignsService;
    }
    async transform(campaignId) {
        const canBeChanged = await this.campaignsService.canBeChanged(campaignId);
        if (!canBeChanged) {
            throw new common_1.ForbiddenException(`This record can only be changed if the status is different from "${types_1.CampaignStatus.CANCELED}"`);
        }
        return campaignId;
    }
};
CanBeChangedPipe = __decorate([
    __param(0, (0, common_1.Inject)(services_1.CampaignsService)),
    __metadata("design:paramtypes", [services_1.CampaignsService])
], CanBeChangedPipe);
exports.CanBeChangedPipe = CanBeChangedPipe;
//# sourceMappingURL=can-be-changed.pipe.js.map