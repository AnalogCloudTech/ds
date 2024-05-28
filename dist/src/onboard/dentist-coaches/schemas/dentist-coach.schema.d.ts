import { HydratedDocument } from 'mongoose';
export declare class DentistCoach {
    name: string;
    email: string;
    hubspotId: string;
    image: string;
    calendarId: string;
    meetingLink: string;
    schedulingPoints: number;
    enabled: boolean;
}
export type DentistCoachDocument = HydratedDocument<DentistCoach>;
export declare const DentistCoachSchema: import("mongoose").Schema<DentistCoach, import("mongoose").Model<DentistCoach, any, any, any>, any, any>;
