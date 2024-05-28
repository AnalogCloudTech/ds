import { Injectable, Logger } from '@nestjs/common';
import { ConsoleService } from 'nestjs-console';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { LoggerPayload } from '@/internal/utils/logger';
import { DateTime } from 'luxon';
import { CONTEXT_API_KEY_CLI_SERVICE } from '@/internal/common/contexts';
@Injectable()
export class ApiKeysCliService {
  constructor(
    private readonly consoleService: ConsoleService,
    private readonly apiKeysService: ApiKeysService,
    private readonly logger: Logger,
  ) {
    const cli = this.consoleService.getCli();
    const groupCommand = this.consoleService.createGroupCommand(
      {
        command: 'api-keys',
        description: 'Manipulate API keys',
      },
      cli,
    );

    this.consoleService.createCommand(
      {
        command: 'create <title>',
        description: 'Create an API key',
      },
      this.createApiKey,
      groupCommand,
    );
  }

  createApiKey = async (title: string): Promise<void> => {
    const createApiKeyDto: CreateApiKeyDto = { title };
    const apiKey = await this.apiKeysService.create(createApiKeyDto);
    this.logger.log(
      {
        payload: <LoggerPayload>{
          usageDate: DateTime.now(),
          title,
          key: apiKey.key,
        },
      },
      CONTEXT_API_KEY_CLI_SERVICE,
    );
  };
}
