import { HydratedDocument } from 'mongoose';
export declare class TrackingPixel {
    offerCode: string;
    trackingCode: string;
}
export type TrackingPixelDocument = HydratedDocument<TrackingPixel>;
export declare const TrackingPixelSchema: import("mongoose").Schema<TrackingPixel, import("mongoose").Model<TrackingPixel, any, any, any>, any, any>;
