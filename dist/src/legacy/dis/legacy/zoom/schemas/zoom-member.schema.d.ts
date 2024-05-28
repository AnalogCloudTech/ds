import { HydratedDocument } from 'mongoose';
export declare class ZoomMember {
    hostEmail: string;
    fullName: string;
    zoomAwsUpload: boolean;
    zoomAwsDelete: boolean;
    zoomAppInstantDelete: boolean;
    zoomAppLaterDelete: boolean;
    zoomIQSalesAccount: boolean;
}
export type ZoomMemberDocument = HydratedDocument<ZoomMember>;
export declare const ZoomMemberSchema: import("mongoose").Schema<ZoomMember, import("mongoose").Model<ZoomMember, any, any, any>, any, any>;
