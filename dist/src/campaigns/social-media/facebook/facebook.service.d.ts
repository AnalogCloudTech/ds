import { CreateFacebookDto } from './dto/create-facebook.dto';
import { Model } from 'mongoose';
import { FacebookDocument } from './schemas/facebook.schema';
import { ConfigService } from '@nestjs/config';
export declare class FacebookService {
    private readonly facebookModel;
    private readonly configService;
    constructor(facebookModel: Model<FacebookDocument>, configService: ConfigService);
    create(createFacebookDto: CreateFacebookDto): Promise<any>;
}
