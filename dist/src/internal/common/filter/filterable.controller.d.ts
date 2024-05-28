import { FilterableService } from './filterable.service';
export declare abstract class FilterableController<T> {
    protected abstract getFilterableService(): FilterableService<T>;
    filter(filter?: string): Promise<T[]>;
}
