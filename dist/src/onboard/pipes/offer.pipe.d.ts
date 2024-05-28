import { PipeTransform } from '@nestjs/common';
import { OnboardService } from '../onboard.service';
import { OfferDocument } from '../schemas/offer.schema';
export declare class OfferPipe implements PipeTransform {
    private readonly service;
    constructor(service: OnboardService);
    transform(offerCode: string): Promise<OfferDocument>;
}
