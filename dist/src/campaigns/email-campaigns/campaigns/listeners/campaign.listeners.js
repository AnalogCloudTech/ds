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
exports.CampaignListeners = exports.CampaignEvents = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const campaign_no_leads_event_1 = require("../events/campaign.no-leads.event");
const campaign_without_available_leads_exception_1 = require("../Exceptions/campaign-without-available-leads.exception");
const campaign_without_available_emails_exception_1 = require("../Exceptions/campaign-without-available-emails.exception");
const campaign_no_emails_event_1 = require("../events/campaign.no-emails.event");
var CampaignEvents;
(function (CampaignEvents) {
    CampaignEvents["NO_LEADS"] = "no-leads";
    CampaignEvents["NO_EMAILS"] = "no-emails";
})(CampaignEvents = exports.CampaignEvents || (exports.CampaignEvents = {}));
let CampaignListeners = class CampaignListeners {
    handleCampaignNoLeads(event) {
        console.info(`Campaign ${event.campaign._id} has no leads`);
        throw new campaign_without_available_leads_exception_1.CampaignWithoutAvailableLeadsException();
    }
    handleCampaignNoEmails(event) {
        console.info(`Campaign ${event.campaign._id} has no emails`);
        throw new campaign_without_available_emails_exception_1.CampaignWithoutAvailableEmailsException();
    }
};
__decorate([
    (0, event_emitter_1.OnEvent)(CampaignEvents.NO_LEADS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [campaign_no_leads_event_1.CampaignNoLeadsEvent]),
    __metadata("design:returntype", Promise)
], CampaignListeners.prototype, "handleCampaignNoLeads", null);
__decorate([
    (0, event_emitter_1.OnEvent)(CampaignEvents.NO_EMAILS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [campaign_no_emails_event_1.CampaignNoEmailsEvent]),
    __metadata("design:returntype", Promise)
], CampaignListeners.prototype, "handleCampaignNoEmails", null);
CampaignListeners = __decorate([
    (0, common_1.Injectable)()
], CampaignListeners);
exports.CampaignListeners = CampaignListeners;
//# sourceMappingURL=campaign.listeners.js.map