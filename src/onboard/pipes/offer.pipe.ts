import { Injectable, PipeTransform } from '@nestjs/common';
import { OnboardService } from '../onboard.service';
import { OfferDocument } from '../schemas/offer.schema';

@Injectable()
export class OfferPipe implements PipeTransform {
  constructor(private readonly service: OnboardService) {}
  async transform(offerCode: string): Promise<OfferDocument> {
    return this.service.findMainOffer(offerCode);
  }
}
