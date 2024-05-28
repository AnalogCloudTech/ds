import { PipeTransform } from '@nestjs/common';
import { LeadHistoryStatus, RelationTypes } from '../../schemas/types';
export interface Filters {
    status?: LeadHistoryStatus[];
    types?: RelationTypes[];
    [key: string]: any;
}
export default class EmailHistoryFilters implements PipeTransform {
    transform({ types, status }: {
        types: string;
        status: string;
    }): {
        types: RelationTypes[];
        status: LeadHistoryStatus[];
    };
}
