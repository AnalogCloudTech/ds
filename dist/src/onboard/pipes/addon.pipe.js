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
exports.AddonPipe = void 0;
const common_1 = require("@nestjs/common");
const onboard_service_1 = require("../onboard.service");
let AddonPipe = class AddonPipe {
    constructor(service) {
        this.service = service;
    }
    async transform(offerCode) {
        return this.service.findAddonOffer(offerCode);
    }
};
AddonPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [onboard_service_1.OnboardService])
], AddonPipe);
exports.AddonPipe = AddonPipe;
//# sourceMappingURL=addon.pipe.js.map