import { Logger } from '@nestjs/common';

export class OfferNotFound extends Error {
  public readonly logger = new Logger(OfferNotFound.name);
  constructor(msg = 'Offer not found') {
    super(msg);
    this.logger.error('Offer not found');
  }
}
