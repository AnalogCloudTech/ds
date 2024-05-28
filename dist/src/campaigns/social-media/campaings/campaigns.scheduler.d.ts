/// <reference types="bull" />
import { CampaingsService } from './campaings.service';
export declare class SMCampaignsScheduler {
    private readonly campaignsService;
    constructor(campaignsService: CampaingsService);
    handleCampaigns(): Promise<import("bull").Job<any>>;
    handleAttributes(): Promise<void>;
}
