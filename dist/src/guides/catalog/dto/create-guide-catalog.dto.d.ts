import { Type } from '@/guides/catalog/schemas/guide-catalog.schema';
export declare class CreateGuideCatalogDto {
    guideName: string;
    guideId: string;
    thumbnail: string;
    pdfUrl?: string;
    position: number;
    type: Type;
}
