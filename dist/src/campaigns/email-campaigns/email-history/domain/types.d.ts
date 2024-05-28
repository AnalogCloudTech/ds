import { SchemaId } from '@/internal/types/helpers';
export declare const statusMap: {
    bounce: string;
    open: string;
    rejected: string;
    complaint: string;
    delivery: string;
    unsubscribed: string;
    send: string;
};
export declare function transformTitle({ obj }: {
    obj: any;
}): any;
export declare function transformStatus({ obj }: {
    obj: any;
}): any;
export declare function transformSortBy({ value }: {
    value: string;
}): {};
export declare function transformType({ obj }: {
    obj: any;
}): any;
export type EmailHistoryReport = {
    lead: string;
    status: string;
    relationId: string;
    relationType: string;
    createdAt: Date;
    updatedAt: Date;
};
export type CampaignsIds = {
    _id: SchemaId;
};
export type CampaignsHistoryIds = {
    _id: SchemaId;
};
