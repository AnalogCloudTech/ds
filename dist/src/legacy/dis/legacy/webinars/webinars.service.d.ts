import { HttpService } from '@nestjs/axios';
import { WebinarDto } from './dto/webinar.dto';
import { RegisterWebinarDto } from './dto/registerWebinar.dto';
export declare class WebinarsService {
    private readonly httpService;
    constructor(httpService: HttpService);
    getWebinar(webinarCode: string): Promise<WebinarDto>;
    registerWebinar(webinarCode: string, registerWebinar: RegisterWebinarDto): Promise<string>;
}
