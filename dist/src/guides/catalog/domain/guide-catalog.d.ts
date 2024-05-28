import { Type } from '@/guides/catalog/schemas/guide-catalog.schema';
export declare class GuideCatalog {
    guideName: string;
    guideId: string;
    thumbnail: string;
    pdfUrl?: string;
    position: number;
    type: Type;
}
