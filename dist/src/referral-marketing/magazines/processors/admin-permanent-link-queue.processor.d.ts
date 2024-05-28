import { Job } from 'bull';
import { MagazineDocument } from '@/referral-marketing/magazines/schemas/magazine.schema';
import { MagazinesService } from '@/referral-marketing/magazines/services/magazines.service';
import { GeneratedMagazinesService } from '@/referral-marketing/magazines/services/generated-magazines.service';
import { FlippingBookService } from '@/integrations/flippingbook/services/flippingbook.service';
import { CustomersService } from '@/customers/customers/customers.service';
export declare class AdminPermanentLinkQueueProcessor {
    private readonly magazinesService;
    private readonly generatedMagazinesService;
    private readonly flippingBookService;
    private readonly customerService;
    constructor(magazinesService: MagazinesService, generatedMagazinesService: GeneratedMagazinesService, flippingBookService: FlippingBookService, customerService: CustomersService);
    handleJob(job: Job<{
        magazine: MagazineDocument;
    }>): Promise<void>;
    private generatedMagazineValidation;
    private checkFlippingBookPermanentUrl;
}
