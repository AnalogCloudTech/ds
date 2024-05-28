import { Document } from 'mongoose';
export declare class CustomLandingPage {
    customerId: string;
    email: string;
}
export type CustomLandingPageDocument = CustomLandingPage & Document;
export declare const CustomLandingPageSchema: import("mongoose").Schema<CustomLandingPage, import("mongoose").Model<CustomLandingPage, any, any, any>, any, any>;
