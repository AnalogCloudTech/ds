import { Model } from 'mongoose';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import { ApiKey, ApiKeyDocument } from './schemas/api-key.schema';
export declare class ApiKeysService {
    private apiKeyModel;
    constructor(apiKeyModel: Model<ApiKeyDocument>);
    create(createApiKeyDto: CreateApiKeyDto): Promise<ApiKey & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>;
    findOne(id: string): Promise<ApiKey>;
    findByKey(key: string): Promise<ApiKey>;
    update(id: string, updateApiKeyDto: UpdateApiKeyDto): Promise<ApiKey>;
    remove(id: string): Promise<ApiKey>;
}
