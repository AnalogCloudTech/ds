export type SegmentQueryFilters = {
  filters: {
    name: string | null;
    bookId: string | null;
    ids: Array<number> | null;
  };
};

export type SegmentQueryFiltersById = {
  filters: {
    ids: Array<number> | null;
  };
};
