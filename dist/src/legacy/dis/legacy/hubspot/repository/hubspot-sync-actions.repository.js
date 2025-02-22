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
exports.HubspotSyncActionsRepository = void 0;
const common_1 = require("@nestjs/common");
const generic_repository_1 = require("../../../../../internal/common/repository/generic.repository");
const hubspot_sync_actions_schema_1 = require("../schemas/hubspot-sync-actions.schema");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
let HubspotSyncActionsRepository = class HubspotSyncActionsRepository extends generic_repository_1.GenericRepository {
    constructor(model) {
        super(model);
        this.model = model;
    }
};
HubspotSyncActionsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(hubspot_sync_actions_schema_1.HubspotSyncActions.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], HubspotSyncActionsRepository);
exports.HubspotSyncActionsRepository = HubspotSyncActionsRepository;
//# sourceMappingURL=hubspot-sync-actions.repository.js.map