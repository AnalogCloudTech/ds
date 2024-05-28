import { CmsService } from '@/cms/cms/cms.service';
export declare class CmsController {
    private readonly cmsService;
    constructor(cmsService: CmsService);
    passthruGet(req: any, routeObject: any, params: string): Promise<any>;
}
