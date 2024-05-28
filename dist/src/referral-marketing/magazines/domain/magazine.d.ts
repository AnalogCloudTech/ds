import { Replacer, Selection } from '@/referral-marketing/magazines/domain/types';
import { Types } from 'mongoose';
export declare class MagazineDomain {
    id: Types.ObjectId;
    customer: Types.ObjectId;
    month: string;
    year: string;
    selections: Selection[];
    magazineId: number;
    baseReplacers: Replacer[];
    status: string;
    contentUrl: string;
    createdAt: Date;
    updatedAt: Date;
}
