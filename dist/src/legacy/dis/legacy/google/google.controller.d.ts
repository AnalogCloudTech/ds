import { GoogleService } from './google.service';
export declare class GoogleController {
    private readonly googleService;
    constructor(googleService: GoogleService);
    getBusySlots(): string;
}
