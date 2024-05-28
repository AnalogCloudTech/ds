import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { PaymentStatusDto } from '@/payments/payment_chargify/dto/payment-status.dto';
import { SchemaId } from '@/internal/types/helpers';

@WebSocketGateway({ cors: { origin: '*' } })
export class PaymentsWebsocketGateway {
  @WebSocketServer() wss: Server;
  constructor(private readonly logger: Logger) {}

  sendGenericStatus(
    { id, email, isApproved }: PaymentStatusDto,
    eventPrefix: string,
  ) {
    return this.wss.sockets.emit(`${eventPrefix}_${email}_${id}`, {
      isApproved,
    });
  }

  sendPaymentStatus({ id, email, isApproved }: PaymentStatusDto) {
    this.logger.log('sending payment success');
    return this.sendGenericStatus({ id, email, isApproved }, 'payment');
  }

  sendUpsellStatus({
    id,
    email,
    isApproved,
    sessionId,
    offerCode,
  }: PaymentStatusDto & { sessionId: SchemaId; offerCode: string }) {
    this.logger.log('sending upsell success');
    return this.wss.sockets.emit(`upsell_${email}_${id}`, {
      isApproved,
      sessionId,
      offerCode,
    });
  }

  sendRMStatus({ id, email, isApproved }: PaymentStatusDto) {
    return this.sendGenericStatus({ id, email, isApproved }, 'rmm');
  }
}
