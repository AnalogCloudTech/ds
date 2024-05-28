import { Document } from 'mongoose';
export declare class ApiKey {
    id: string;
    title: string;
    key: string;
}
export type ApiKeyDocument = ApiKey & Document;
export declare const ApiKeySchema: import("mongoose").Schema<ApiKey, import("mongoose").Model<ApiKey, any, any, any>, any, any>;
