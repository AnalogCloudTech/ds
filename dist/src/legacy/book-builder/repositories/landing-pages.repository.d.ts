import { Model } from 'mongoose';
import { CreateCustomUrlDto } from '../dto/create-custom-url.dto';
import { CustomLandingPage, CustomLandingPageDocument } from '../schemas/custom-landing-page.schema';
export declare class LandingPagesRepository {
    private readonly model;
    constructor(model: Model<CustomLandingPageDocument>);
    findByEmail(email: string): Promise<CustomLandingPageDocument>;
    create(dto: CreateCustomUrlDto): Promise<CustomLandingPageDocument>;
    update(id: string, dtoUpdate: Partial<CustomLandingPage>): Promise<CustomLandingPageDocument>;
    delete(id: string): Promise<CustomLandingPageDocument>;
}
