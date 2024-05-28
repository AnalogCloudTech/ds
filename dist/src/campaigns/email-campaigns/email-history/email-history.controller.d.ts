import { Paginator } from '@/internal/utils/paginator';
import { Logger } from '@nestjs/common';
import { Request } from 'express';
import { EmailHistoryService } from './email-history.service';
import { Filters } from './pipes/filters/filters.pipe';
export declare class EmailHistoryController {
    private readonly emailHistoryService;
    private readonly logger;
    constructor(emailHistoryService: EmailHistoryService, logger: Logger);
    index(req: any, id: string): Promise<import("./schemas/email-history.schema").EmailHistoryDocument[]>;
    list(req: any, { page, perPage }: Paginator, { status, type }: Filters): Promise<import("@/internal/utils/paginator").PaginatorSchematicsInterface<import("./schemas/email-history.schema").EmailHistoryDocument>>;
    listByLead(req: any, leadId: string, { page, perPage }: Paginator, { status, types }: Filters): Promise<import("@/internal/utils/paginator").PaginatorSchematicsInterface<import("./schemas/email-history.schema").EmailHistoryDocument>>;
    create(req: Request): Promise<import("./schemas/email-history.schema").EmailHistoryDocument[]>;
}
