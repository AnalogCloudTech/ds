import { HydratedDocument } from 'mongoose';
export declare enum Type {
    MAGAZINE = "magazine",
    GUIDE = "guide",
    BOOK = "book",
    PACKET = "packet"
}
export declare class GuideCatalog {
    guideName: string;
    guideId: string;
    thumbnail: string;
    pdfUrl?: string;
    position: number;
    type: Type;
}
export type GuideCatalogDocument = HydratedDocument<GuideCatalog>;
export declare const GuideCatalogSchema: import("mongoose").Schema<GuideCatalog, import("mongoose").Model<GuideCatalog, any, any, any>, any, any>;
