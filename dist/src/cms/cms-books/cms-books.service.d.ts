import { Axios } from 'axios';
import { CmsBooksRepository } from '@/cms/cms-books/cms-books.repository';
import { CmsBookDomain } from '@/cms/cms-books/domain/cms-book';
export declare class CmsBooksService {
    private readonly http;
    protected readonly repository: CmsBooksRepository;
    constructor(http: Axios, repository: CmsBooksRepository);
    findAll(): Promise<Array<CmsBookDomain>>;
}
