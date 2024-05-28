import { HydratedDocument, SchemaTimestampsConfig } from 'mongoose';
export declare class ZoomPhoneUser {
    email: string;
}
export type ZoomPhoneUserDocument = SchemaTimestampsConfig & HydratedDocument<ZoomPhoneUser>;
export declare const ZoomPhoneUserSchema: import("mongoose").Schema<ZoomPhoneUser, import("mongoose").Model<ZoomPhoneUser, any, any, any>, any, any>;
