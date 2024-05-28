import { Replacer } from '@/referral-marketing/magazines/domain/types';
export declare class CreateMagazineDto {
    magazineId: number;
    baseReplacers?: Replacer[];
    createdByAutomation?: boolean;
}
