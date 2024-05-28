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
exports.HubspotSyncActionsServices = void 0;
const common_1 = require("@nestjs/common");
const hubspot_sync_actions_repository_1 = require("./repository/hubspot-sync-actions.repository");
const types_1 = require("./domain/types");
const hubspot_service_1 = require("./hubspot.service");
const lodash_1 = require("lodash");
let HubspotSyncActionsServices = class HubspotSyncActionsServices {
    constructor(hubspotSyncActionsRepository, hubspotService) {
        this.hubspotSyncActionsRepository = hubspotSyncActionsRepository;
        this.hubspotService = hubspotService;
    }
    async create(data) {
        return this.hubspotSyncActionsRepository.store(data);
    }
    async update(id, data) {
        return this.hubspotSyncActionsRepository.update(id, data);
    }
    async addBookCreditsToCustomer(refId, credits) {
        const syncCreditsData = {
            data: {
                newCredits: credits,
            },
            action: types_1.ACTIONS.ADD_CREDITS,
            refId,
        };
        return this.create(syncCreditsData);
    }
    async enrollContactToList(refId, listId) {
        const enrollContactToList = {
            data: {
                listId,
            },
            action: types_1.ACTIONS.ENROLL_CONTACT_TO_LIST,
            refId,
        };
        return this.create(enrollContactToList);
    }
    async setBookPackages(refId, bookPackages) {
        const setBookPackagesData = {
            data: {
                bookPackages,
            },
            action: types_1.ACTIONS.SET_BOOK_PACKAGES,
            refId,
        };
        return this.create(setBookPackagesData);
    }
    async handleAddCredits(hubspotSyncActionDocument) {
        var _a, _b, _c;
        const hubspotContact = await this.hubspotService.getContactDetailsByEmail(hubspotSyncActionDocument.refId);
        if (!hubspotContact) {
            await this.update(hubspotSyncActionDocument._id, {
                $push: { syncResult: 'Contact not found' },
                $inc: { attempts: 1 },
                status: types_1.STATUS.PENDING,
            });
            return;
        }
        const { newCredits } = hubspotSyncActionDocument.data;
        const totalCredits = Number((_c = (_b = (_a = hubspotContact.properties) === null || _a === void 0 ? void 0 : _a.afy_book_credits) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : 0) +
            newCredits;
        await this.hubspotService.updateContactById(hubspotContact.vid.toString(), {
            properties: {
                afy_book_credits: totalCredits.toString(),
            },
        });
        await this.update(hubspotSyncActionDocument._id, {
            $inc: { attempts: 1 },
            status: types_1.STATUS.COMPLETED,
        });
    }
    async handleEnrollContactToList(hubspotSyncActionDocument) {
        const hubspotContact = await this.hubspotService.getContactDetailsByEmail(hubspotSyncActionDocument.refId);
        if (!hubspotContact) {
            await this.update(hubspotSyncActionDocument._id, {
                $push: { syncResult: 'Contact not found' },
                $inc: { attempts: 1 },
                status: types_1.STATUS.PENDING,
            });
            return;
        }
        const { listId } = hubspotSyncActionDocument.data;
        await this.hubspotService.enrollContactsToList(listId, [
            hubspotSyncActionDocument.refId,
        ]);
        await this.update(hubspotSyncActionDocument._id, {
            $inc: { attempts: 1 },
            status: types_1.STATUS.COMPLETED,
        });
    }
    async handleSetBookPackages(hubspotSyncActionDocument) {
        var _a, _b, _c;
        const hubspotContact = await this.hubspotService.getContactDetailsByEmail(hubspotSyncActionDocument.refId);
        if (!hubspotContact) {
            await this.update(hubspotSyncActionDocument._id, {
                $push: { syncResult: 'Contact not found' },
                $inc: { attempts: 1 },
                status: types_1.STATUS.PENDING,
            });
            return;
        }
        const { bookPackages } = (hubspotSyncActionDocument.data);
        const oldPackages = (0, lodash_1.split)((_c = (_b = (_a = hubspotContact.properties) === null || _a === void 0 ? void 0 : _a.afy_package) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : '', ';').filter(Boolean);
        const packages = (0, lodash_1.union)(oldPackages, bookPackages);
        await this.hubspotService.updateContactById(hubspotContact.vid.toString(), {
            properties: {
                afy_package: (0, lodash_1.join)(packages, ';'),
            },
        });
        await this.update(hubspotSyncActionDocument._id, {
            $inc: { attempts: 1 },
            status: types_1.STATUS.COMPLETED,
        });
    }
    async handleSyncEvent(hubspotSyncActionDocument) {
        await this.update(hubspotSyncActionDocument._id, {
            status: types_1.STATUS.PROCESSING,
        });
        switch (hubspotSyncActionDocument.action) {
            case types_1.ACTIONS.ADD_CREDITS:
                return await this.handleAddCredits(hubspotSyncActionDocument);
            case types_1.ACTIONS.ENROLL_CONTACT_TO_LIST:
                return await this.handleEnrollContactToList(hubspotSyncActionDocument);
            case types_1.ACTIONS.SET_BOOK_PACKAGES:
                return await this.handleSetBookPackages(hubspotSyncActionDocument);
            default:
                return null;
        }
    }
};
HubspotSyncActionsServices = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [hubspot_sync_actions_repository_1.HubspotSyncActionsRepository,
        hubspot_service_1.HubspotService])
], HubspotSyncActionsServices);
exports.HubspotSyncActionsServices = HubspotSyncActionsServices;
//# sourceMappingURL=hubspot-sync-actions.services.js.map