import { CmsBooksService } from './cms-books.service';
import { CmsBookDomain } from '@/cms/cms-books/domain/cms-book';
export declare class CmsBooksController {
    private readonly cmsBooksService;
    constructor(cmsBooksService: CmsBooksService);
    list(): Promise<Array<CmsBookDomain>>;
}
