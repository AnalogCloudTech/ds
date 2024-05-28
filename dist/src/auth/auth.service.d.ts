import { ApiKeysService } from '@/auth/api-keys/api-keys.service';
import { ApiKey } from '@/auth/api-keys/schemas/api-key.schema';
import { JwtService } from '@nestjs/jwt';
export declare const API_KEY_PREFIX = "afy-api-key";
export declare const IS_PUBLIC_KEY = "isPublic";
export declare const IS_APIKEY_ONLY_KEY = "isApiKeyOnly";
export declare const Public: () => import("@nestjs/common").CustomDecorator<string>;
export declare const ApiKeyOnly: () => import("@nestjs/common").CustomDecorator<string>;
export declare class AuthService {
    private readonly apiKeysService;
    private readonly jwtService;
    constructor(apiKeysService: ApiKeysService, jwtService: JwtService);
    validateApiKey(key: string): Promise<ApiKey>;
    login(user: any): {
        access_token: string;
    };
}
