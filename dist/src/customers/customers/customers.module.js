"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const customers_service_1 = require("./customers.service");
const customers_controller_1 = require("./customers.controller");
const customer_schema_1 = require("./schemas/customer.schema");
const customer_subscription_schema_1 = require("./schemas/customer-subscription.schema");
const dis_module_1 = require("../../legacy/dis/dis.module");
const dis_service_1 = require("../../legacy/dis/dis.service");
const customers_repository_1 = require("./customers.repository");
const customers_subscriptions_repository_1 = require("./customers-subscriptions.repository");
const hubspot_module_1 = require("../../legacy/dis/legacy/hubspot/hubspot.module");
let CustomersModule = class CustomersModule {
};
CustomersModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: customer_schema_1.Customer.name, schema: customer_schema_1.CustomerSchema },
                { name: customer_subscription_schema_1.CustomerSubscription.name, schema: customer_subscription_schema_1.CustomerSubscriptionSchema },
            ]),
            dis_module_1.DisModule,
            (0, common_1.forwardRef)(() => hubspot_module_1.HubspotModule),
        ],
        controllers: [customers_controller_1.CustomersController],
        providers: [
            customers_service_1.CustomersService,
            dis_service_1.DisService,
            customers_repository_1.CustomersRepository,
            customers_subscriptions_repository_1.CustomersSubscriptionsRepository,
            common_1.Logger,
        ],
        exports: [
            customers_service_1.CustomersService,
            mongoose_1.MongooseModule,
            dis_service_1.DisService,
            customers_repository_1.CustomersRepository,
            customers_subscriptions_repository_1.CustomersSubscriptionsRepository,
        ],
    })
], CustomersModule);
exports.CustomersModule = CustomersModule;
//# sourceMappingURL=customers.module.js.map