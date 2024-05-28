/// <reference types="mongoose" />
import { CoachDocument } from '@/onboard/coaches/schemas/coach.schema';
import { CoachesService } from '@/onboard/coaches/coaches.service';
import { OnboardService } from '@/onboard/onboard.service';
import { CreateOfferDto } from '@/onboard/dto/create-offer.dto';
export declare function createCoach(coachesService: CoachesService, toOverride?: Partial<CoachDocument>): Promise<CoachDocument>;
export declare function setAllCoachesSchedulingPoints(coachesService: CoachesService, schedulingPoints?: number): Promise<void>;
export declare function createOffer(onboardService: OnboardService, toOverride?: Partial<CreateOfferDto>): Promise<import("mongoose").Document<unknown, any, import("../../schemas/offer.schema").Offer> & import("../../schemas/offer.schema").Offer & {
    _id: import("mongoose").Types.ObjectId;
}>;
