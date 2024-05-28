import { FacebookService } from './facebook.service';
import { CreateFacebookDto } from './dto/create-facebook.dto';
import { FacebookDomain } from './domain/facebook.domain';
export declare class FacebookController {
    private readonly facebookService;
    constructor(facebookService: FacebookService);
    create(createFacebookDto: CreateFacebookDto): Promise<FacebookDomain>;
}
