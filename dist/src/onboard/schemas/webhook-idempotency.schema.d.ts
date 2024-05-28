import { Document } from 'mongoose';
export declare class WebhookIdempotency {
    key: string;
    objectType: string;
}
export type WebhookIdempotencyDocument = WebhookIdempotency & Document;
export declare const WebhookIdempotencySchema: import("mongoose").Schema<WebhookIdempotency, import("mongoose").Model<WebhookIdempotency, any, any, any>, any, any>;
