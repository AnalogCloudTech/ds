export type SortableFields<T> = Array<{
  [K in keyof Partial<T>]: SortDirections;
}>;

export enum SortDirections {
  ASC = 'asc',
  DESC = 'desc',
}

export interface Sortable<T> {
  sort: SortableFields<T>;
}
