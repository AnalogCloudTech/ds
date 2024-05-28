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
exports.CustomerMilestoneSchema = exports.CustomerMilestone = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const types_1 = require("../../customers/domain/types");
const customer_schema_1 = require("../../customers/schemas/customer.schema");
let CustomerMilestone = class CustomerMilestone {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true, ref: customer_schema_1.Customer.name, type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", Object)
], CustomerMilestone.prototype, "customer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: types_1.CustomerMilestoneStatus }),
    __metadata("design:type", String)
], CustomerMilestone.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CustomerMilestone.prototype, "dateChecked", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: types_1.CustomerMilestones }),
    __metadata("design:type", String)
], CustomerMilestone.prototype, "milestoneName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], CustomerMilestone.prototype, "value", void 0);
CustomerMilestone = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'ds__customers_milestone' })
], CustomerMilestone);
exports.CustomerMilestone = CustomerMilestone;
exports.CustomerMilestoneSchema = mongoose_1.SchemaFactory.createForClass(CustomerMilestone);
//# sourceMappingURL=customer-milestone.schema.js.map