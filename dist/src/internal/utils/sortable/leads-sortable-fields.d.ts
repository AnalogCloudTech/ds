import { SortDirections } from '@/internal/utils/sortable/sortable';
export interface LeadsSortableFields {
    firstName: SortDirections;
    lastName: SortDirections;
    email: SortDirections;
    phone: SortDirections;
    allSegments: SortDirections;
    isValid: SortDirections;
    unsubscribed: SortDirections;
}
