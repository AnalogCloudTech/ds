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
exports.ZoomPhoneUserSchema = exports.ZoomPhoneUser = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let ZoomPhoneUser = class ZoomPhoneUser {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ZoomPhoneUser.prototype, "email", void 0);
ZoomPhoneUser = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'ds__zoom_phone_users',
    })
], ZoomPhoneUser);
exports.ZoomPhoneUser = ZoomPhoneUser;
exports.ZoomPhoneUserSchema = mongoose_1.SchemaFactory.createForClass(ZoomPhoneUser);
//# sourceMappingURL=zoom-phone-user.schema.js.map