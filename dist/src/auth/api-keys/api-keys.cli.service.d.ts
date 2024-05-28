import { Logger } from '@nestjs/common';
import { ConsoleService } from 'nestjs-console';
import { ApiKeysService } from './api-keys.service';
export declare class ApiKeysCliService {
    private readonly consoleService;
    private readonly apiKeysService;
    private readonly logger;
    constructor(consoleService: ConsoleService, apiKeysService: ApiKeysService, logger: Logger);
    createApiKey: (title: string) => Promise<void>;
}
