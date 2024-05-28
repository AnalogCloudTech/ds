import { Model } from 'mongoose';
export declare abstract class FilterableService<T> {
    protected abstract getFilterableModel(): Model<T>;
    search(filter?: string): Promise<T[]>;
}
