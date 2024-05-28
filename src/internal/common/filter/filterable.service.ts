import { Model } from 'mongoose';
import filter2dbquery from 'filter2dbquery';

const { parseFilterQuery } = filter2dbquery;

export abstract class FilterableService<T> {
  protected abstract getFilterableModel(): Model<T>;
  search(filter?: string): Promise<T[]> {
    const parsedFilter = parseFilterQuery(filter);
    return this.getFilterableModel().find(parsedFilter).exec();
  }
}
