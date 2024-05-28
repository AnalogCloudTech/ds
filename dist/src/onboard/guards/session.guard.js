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
exports.SessionGuard = void 0;
const common_1 = require("@nestjs/common");
const onboard_service_1 = require("../onboard.service");
let SessionGuard = class SessionGuard {
    constructor(service) {
        this.service = service;
    }
    async canActivate(context) {
        var _a, _b;
        const request = context.switchToHttp().getRequest();
        const sessionId = (_a = request.query.sessionId) === null || _a === void 0 ? void 0 : _a.toString();
        const offerCode = (_b = request.query.offerCode) === null || _b === void 0 ? void 0 : _b.toString();
        const sessionExists = await this.service.sessionExists(sessionId, offerCode);
        if (!sessionExists) {
            throw new common_1.HttpException('Incorrect Session Id', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        return true;
    }
};
SessionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [onboard_service_1.OnboardService])
], SessionGuard);
exports.SessionGuard = SessionGuard;
//# sourceMappingURL=session.guard.js.map