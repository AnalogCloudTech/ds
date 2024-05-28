import { ZoomId } from './types';
export declare class Zoom {
    id: ZoomId;
    hostEmail: string;
    fileLocation: string;
    bucketName: string;
    keyName: string;
    topic: boolean;
    startTime: string;
    zoomCloudDeletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
export declare class ZoomMember {
    id: ZoomId;
    hostEmail: string;
    fullName: string;
    zoomAwsUpload: boolean;
    zoomAwsDelete: boolean;
    zoomAppInstantDelete: boolean;
    zoomAppLaterDelete: boolean;
    zoomIQSalesAccount: boolean;
    createdAt: Date;
    updatedAt: Date;
}
