import { Axios } from 'axios';
import { CmsBookDomain } from '@/cms/cms-books/domain/cms-book';
import { Logger } from '@nestjs/common';
export declare class CmsBooksRepository {
    private readonly http;
    private readonly logger;
    private baseRoute;
    constructor(http: Axios, logger: Logger);
    findAll(): Promise<Array<CmsBookDomain>>;
}
