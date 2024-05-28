import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { PaymentStatusDto } from '@/payments/payment_chargify/dto/payment-status.dto';
import { SchemaId } from '@/internal/types/helpers';
export declare class PaymentsWebsocketGateway {
    private readonly logger;
    wss: Server;
    constructor(logger: Logger);
    sendGenericStatus({ id, email, isApproved }: PaymentStatusDto, eventPrefix: string): boolean;
    sendPaymentStatus({ id, email, isApproved }: PaymentStatusDto): boolean;
    sendUpsellStatus({ id, email, isApproved, sessionId, offerCode, }: PaymentStatusDto & {
        sessionId: SchemaId;
        offerCode: string;
    }): boolean;
    sendRMStatus({ id, email, isApproved }: PaymentStatusDto): boolean;
}
