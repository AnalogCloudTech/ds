declare enum Operators {
    $eq = "$eq",
    $ne = "$ne",
    $lt = "$lt",
    $lte = "$lte",
    $gt = "$gt",
    $gte = "$gte",
    $in = "$in",
    $notIn = "$notIn",
    $contains = "$contains",
    $notContains = "$notContains",
    $containsi = "$containsi",
    $notContainsi = "$notContainsi",
    $null = "$null",
    $notNull = "$notNull",
    $between = "$between",
    $startsWith = "$startsWith",
    $endsWith = "$endsWith",
    $or = "$or",
    $and = "$and"
}
export type CmsFilterObject = {
    name: string;
    operator: Operators;
    value: string | number | number[] | boolean;
};
export type ResponseSegmentsType = {
    id: number;
    name: string;
};
export type CmsSubQueryObject = {
    operator: Operators;
    value: CmsFilterObject[];
};
export declare class CmsFilterBuilder {
    static build(filters: CmsFilterObject[]): string;
    static buildSubQuery(query: CmsSubQueryObject): string;
}
export {};
