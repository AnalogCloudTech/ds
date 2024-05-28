import { HydratedDocument } from 'mongoose';
import { CoachImageUrl, HubspotId } from '../domain/types';
export declare class Coach {
    name: string;
    email: string;
    hubspotId: HubspotId;
    image: CoachImageUrl;
    calendarId: string;
    meetingLink: string;
    schedulingPoints: number;
    enabled: boolean;
}
export type CoachDocument = HydratedDocument<Coach>;
export declare const CoachSchema: import("mongoose").Schema<Coach, import("mongoose").Model<Coach, any, any, any>, any, any>;
