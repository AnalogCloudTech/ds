/// <reference types="mongoose" />
export declare class Facebook {
    message: string;
    photo: string;
}
export type FacebookDocument = Facebook & Document;
export declare const FacebookSchema: import("mongoose").Schema<Facebook, import("mongoose").Model<Facebook, any, any, any>, any, any>;
