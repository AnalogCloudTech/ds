import { SchemaId } from '@/internal/types/helpers';
export declare class Thumbnail {
    id: string;
    name: string;
    ext: string;
    mime: string;
    url: string;
}
export declare class CmsBookDomain {
    id: SchemaId;
    name: string;
    thumbnail: Thumbnail;
}
