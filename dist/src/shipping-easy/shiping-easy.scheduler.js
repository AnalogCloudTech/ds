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
exports.ShippingEasyScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const customer_properties_service_1 = require("../customers/customer-properties/customer-properties.service");
const dateFormatters_1 = require("../legacy/dis/legacy/common/utils/dateFormatters");
const hubspot_service_1 = require("../legacy/dis/legacy/hubspot/hubspot.service");
const shipping_easy_service_1 = require("./shipping-easy.service");
const lodash_1 = require("lodash");
const hubspot = require("@hubspot/api-client");
const customers_service_1 = require("../customers/customers/customers.service");
const functions_1 = require("../internal/utils/functions");
const constants_1 = require("./constants");
let ShippingEasyScheduler = class ShippingEasyScheduler {
    constructor(shippingEasyService, customerPropertiesService, hubspotService, customersService, logger) {
        this.shippingEasyService = shippingEasyService;
        this.customerPropertiesService = customerPropertiesService;
        this.hubspotService = hubspotService;
        this.customersService = customersService;
        this.logger = logger;
    }
    async handleShippingEasyScheduler() {
        const orders = await this.getShippingEasyOrder();
        const errors = [];
        for (const order of orders) {
            try {
                const afyOrderNo = (0, lodash_1.get)(order, ['recipients', 0, 'original_order', 'custom_1'], '');
                const trackingNumber = (0, lodash_1.get)(order, ['shipments', 0, 'tracking_number']);
                if (afyOrderNo) {
                    const PublicObjectSearchRequest = [
                        {
                            value: afyOrderNo,
                            propertyName: constants_1.AFY_ORDER_NUMBER,
                            operator: hubspot.dealsModels.Filter.OperatorEnum.Eq,
                        },
                    ];
                    const findTicket = await this.hubspotService.searchTicket(PublicObjectSearchRequest);
                    const ticketId = (0, lodash_1.get)(findTicket, ['results', 0, 'id']);
                    const contact = await this.hubspotService.getContactIdByTicketId(ticketId);
                    const contactDetails = await this.hubspotService.getContactById(contact, ['email']);
                    if (ticketId) {
                        const objectInput = {
                            properties: {
                                afy_order_tracking_number: trackingNumber,
                            },
                        };
                        await this.hubspotService.updateTicket(ticketId, objectInput);
                    }
                    const customerEmail = (0, lodash_1.get)(contactDetails, ['properties', 'email']);
                    const customerDetails = await this.customersService.findByEmail(customerEmail);
                    if (!customerDetails) {
                        throw new Error(`could not find customer details from ${customerEmail} in Digital Service`);
                    }
                    const createPropertyPayload = {
                        customer: customerDetails === null || customerDetails === void 0 ? void 0 : customerDetails._id,
                        customerEmail,
                        module: 'shippingEasy',
                        value: 'tracking_number',
                        name: 'ShippingEasy get orders',
                        metadata: {
                            afy_order_tracking_number: trackingNumber,
                            afy_order_no: afyOrderNo,
                        },
                    };
                    await this.customerPropertiesService.create(createPropertyPayload, customerDetails);
                }
                await (0, functions_1.sleep)(2000);
            }
            catch (error) {
                if (error instanceof Error) {
                    errors.push(error);
                }
            }
        }
        if (errors.length) {
            this.logger.error(errors);
        }
    }
    async getShippingEasyOrder() {
        let maxPages = 1;
        let currentPage = 1;
        const orders = [];
        do {
            const records = await this.shippingEasyService.getOrders('shipped', currentPage, 200);
            const metadata = (0, lodash_1.get)(records, ['meta']);
            maxPages = metadata.total_pages;
            orders.push(...records.orders);
            currentPage += 1;
        } while (currentPage < maxPages);
        return orders;
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR, {
        name: 'shippingEasy',
        timeZone: dateFormatters_1.TimeZones.EST,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ShippingEasyScheduler.prototype, "handleShippingEasyScheduler", null);
ShippingEasyScheduler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [shipping_easy_service_1.ShippingEasyService,
        customer_properties_service_1.CustomerPropertiesService,
        hubspot_service_1.HubspotService,
        customers_service_1.CustomersService,
        common_1.Logger])
], ShippingEasyScheduler);
exports.ShippingEasyScheduler = ShippingEasyScheduler;
//# sourceMappingURL=shiping-easy.scheduler.js.map