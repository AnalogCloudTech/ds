export interface PaginatorSchematicsInterface<T = any> {
    data: T[];
    meta: {
        total: number;
        perPage: number;
        currentPage: number;
        lastPage: number;
    };
}
export interface PaginatorSchemaInterface<T = any> {
    data: T;
    meta: {
        total: number;
        perPage: number;
        currentPage: number;
        lastPage: number;
    };
}
export declare class PaginatorSchema {
    static build<T = any>(total: number, data: T[], page: number, perPage: number): PaginatorSchematicsInterface<T>;
    static buildResult<T = any>(total: number, data: T, page: number, perPage: number): PaginatorSchemaInterface<T>;
}
