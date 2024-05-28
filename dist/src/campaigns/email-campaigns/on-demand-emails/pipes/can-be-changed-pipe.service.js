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
exports.CanBeChangedPipe = void 0;
const common_1 = require("@nestjs/common");
const on_demand_emails_service_1 = require("../on-demand-emails.service");
const types_1 = require("../domain/types");
let CanBeChangedPipe = class CanBeChangedPipe {
    constructor(service) {
        this.service = service;
    }
    async transform(onDemandEmailId) {
        const canBeChanged = await this.service.canBeChanged(onDemandEmailId);
        if (!canBeChanged) {
            throw new common_1.ForbiddenException(`This record only can be changed if status is equal to "${types_1.Statuses.STATUS_SCHEDULED}"`);
        }
        return onDemandEmailId;
    }
};
CanBeChangedPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [on_demand_emails_service_1.OnDemandEmailsService])
], CanBeChangedPipe);
exports.CanBeChangedPipe = CanBeChangedPipe;
//# sourceMappingURL=can-be-changed-pipe.service.js.map