export declare class DataObject<T> {
    id: number;
    attributes: T;
}
export declare class ResponseObject<T> {
    data: DataObject<T>;
    meta: any;
    error: any;
}
export declare class ResponseArrayObject<T> {
    data: Array<T>;
    meta: {
        pagination?: Pagination;
    };
    error: any;
}
export declare class QueryParams {
    sort?: string[];
    pagination?: Pagination;
    fields?: string | string[];
    populate?: any;
    filters?: any;
    publicationState?: PublicationState;
}
declare class Pagination {
    page: number;
    pageSize: number;
    pageCount?: number;
    total?: number;
}
export declare enum PublicationState {
    LIVE = "live",
    PREVIEW = "preview"
}
export {};
