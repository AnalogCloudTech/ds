import { HydratedDocument } from 'mongoose';
export declare class ZoomRecording {
    hostEmail: string;
    fileLocation: string;
    bucketName: string;
    keyName: string;
    zoomMeetingId: number;
    zoomMeetinguuid: string;
    topic: string;
    zoomCloudDeletedAt: Date;
    customerName: string;
    startTime: string;
    deletedAt: Date;
}
export type ZoomRecordingDocument = HydratedDocument<ZoomRecording>;
export declare const ZoomRecordingSchema: import("mongoose").Schema<ZoomRecording, import("mongoose").Model<ZoomRecording, any, any, any>, any, any>;
