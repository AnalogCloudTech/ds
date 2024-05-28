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
exports.HubspotSyncActionsProcessor = void 0;
const hubspot_sync_actions_services_1 = require("../hubspot-sync-actions.services");
const bull_1 = require("@nestjs/bull");
const constants_1 = require("../constants");
let HubspotSyncActionsProcessor = class HubspotSyncActionsProcessor {
    constructor(hubspotSyncActionsServices) {
        this.hubspotSyncActionsServices = hubspotSyncActionsServices;
    }
    async handleJob(job) {
        await this.hubspotSyncActionsServices.handleSyncEvent(job.data);
    }
};
__decorate([
    (0, bull_1.Process)({ concurrency: 1 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HubspotSyncActionsProcessor.prototype, "handleJob", null);
HubspotSyncActionsProcessor = __decorate([
    (0, bull_1.Processor)(constants_1.HUBSPOT_SYNC_ACTIONS_QUEUE),
    __metadata("design:paramtypes", [hubspot_sync_actions_services_1.HubspotSyncActionsServices])
], HubspotSyncActionsProcessor);
exports.HubspotSyncActionsProcessor = HubspotSyncActionsProcessor;
//# sourceMappingURL=hubspot-sync-actions.processor.js.map