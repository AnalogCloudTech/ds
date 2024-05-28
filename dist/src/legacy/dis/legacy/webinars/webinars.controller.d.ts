import { WebinarsService } from './webinars.service';
import { RegisterWebinarDto } from './dto/registerWebinar.dto';
export declare class WebinarsController {
    private readonly webinarsService;
    private readonly shouldMockWebinarApi;
    constructor(webinarsService: WebinarsService, shouldMockWebinarApi: boolean);
    findOne(webinarCode: string): Promise<import("./dto/webinar.dto").WebinarDto>;
    register(webinarCode: string, registerWebinar: RegisterWebinarDto): Promise<string> | "Successfully Registered";
}
