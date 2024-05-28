/// <reference types="multer" />
import { Segments } from '@/campaigns/email-campaigns/leads/domain/types';
import { CustomerEmailDto } from '@/internal/common/dtos/customer-email.dto';
export declare class ImportLeadDto implements CustomerEmailDto {
    segments: Segments;
    allSegments: string;
    customerEmail: string;
    file: Express.Multer.File;
    bookId: string;
}
