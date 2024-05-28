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
exports.CoachSchema = exports.Coach = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Coach = class Coach {
    constructor() {
        this.schedulingPoints = 0;
    }
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Coach.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: true }),
    __metadata("design:type", String)
], Coach.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Coach.prototype, "hubspotId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Coach.prototype, "image", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Coach.prototype, "calendarId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Coach.prototype, "meetingLink", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Object)
], Coach.prototype, "schedulingPoints", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true, type: Boolean }),
    __metadata("design:type", Boolean)
], Coach.prototype, "enabled", void 0);
Coach = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'ds__coaches',
        optimisticConcurrency: true,
    })
], Coach);
exports.Coach = Coach;
exports.CoachSchema = mongoose_1.SchemaFactory.createForClass(Coach);
//# sourceMappingURL=coach.schema.js.map