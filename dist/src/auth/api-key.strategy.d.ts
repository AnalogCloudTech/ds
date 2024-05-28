import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { ApiKey } from '@/auth/api-keys/schemas/api-key.schema';
declare const ApiKeyStrategy_base: new (...args: any[]) => Strategy;
export declare class ApiKeyStrategy extends ApiKeyStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(apiKey: string): Promise<ApiKey>;
}
export {};
