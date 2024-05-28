import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { Cover, Replacer, Selection } from '@/referral-marketing/magazines/domain/types';
import { SchemaId } from '@/internal/types/helpers';
export interface CreateMagazineStoreDto {
    month: string;
    year: string;
    magazineId: number;
    customer: SchemaId | CustomerDocument;
    baseReplacers?: Replacer[];
    covers?: Cover[];
    selections?: Selection[];
    contentUrl: string;
    createdByAutomation?: boolean;
}
