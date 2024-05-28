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
exports.PaymentsWebsocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
let PaymentsWebsocketGateway = class PaymentsWebsocketGateway {
    constructor(logger) {
        this.logger = logger;
    }
    sendGenericStatus({ id, email, isApproved }, eventPrefix) {
        return this.wss.sockets.emit(`${eventPrefix}_${email}_${id}`, {
            isApproved,
        });
    }
    sendPaymentStatus({ id, email, isApproved }) {
        this.logger.log('sending payment success');
        return this.sendGenericStatus({ id, email, isApproved }, 'payment');
    }
    sendUpsellStatus({ id, email, isApproved, sessionId, offerCode, }) {
        this.logger.log('sending upsell success');
        return this.wss.sockets.emit(`upsell_${email}_${id}`, {
            isApproved,
            sessionId,
            offerCode,
        });
    }
    sendRMStatus({ id, email, isApproved }) {
        return this.sendGenericStatus({ id, email, isApproved }, 'rmm');
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], PaymentsWebsocketGateway.prototype, "wss", void 0);
PaymentsWebsocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' } }),
    __metadata("design:paramtypes", [common_1.Logger])
], PaymentsWebsocketGateway);
exports.PaymentsWebsocketGateway = PaymentsWebsocketGateway;
//# sourceMappingURL=payments.gateway.js.map