import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsoleModule } from 'nestjs-console';
import { ApiKeysService } from './api-keys.service';
import { ApiKeysCliService } from './api-keys.cli.service';
import { ApiKey, ApiKeySchema } from './schemas/api-key.schema';

@Module({
  imports: [
    ConsoleModule,
    MongooseModule.forFeature([{ name: ApiKey.name, schema: ApiKeySchema }]),
  ],
  providers: [ApiKeysService, ApiKeysCliService, Logger],
  exports: [ApiKeysService],
})
export class ApiKeysModule {}
