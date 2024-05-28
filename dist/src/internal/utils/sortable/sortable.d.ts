export type SortableFields<T> = Array<{
    [K in keyof Partial<T>]: SortDirections;
}>;
export declare enum SortDirections {
    ASC = "asc",
    DESC = "desc"
}
export interface Sortable<T> {
    sort: SortableFields<T>;
}
