import { ChargifyService } from './chargify.service';
import { Request } from 'express';
export declare class ChargifyController {
    private readonly chargifyService;
    constructor(chargifyService: ChargifyService);
    passthruGet(req: Request, routeObject: {
        [key: string]: string;
    }, params: {
        [key: string]: any;
    }, body: {
        [key: string]: any;
    }): Promise<any>;
}
