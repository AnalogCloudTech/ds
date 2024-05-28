import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import AfyLoggerService from '@/integrations/afy-logger/afy-logger.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        if (configService.get<string>('env') == 'test') {
          return null;
        }
        const afyLoggerUrl = configService.get<string>('afyLogger.url');
        if (!afyLoggerUrl) {
          throw new Error('AFY_LOGGER_URL is not defined');
        }
        return {
          timeout: 5000,
          maxRedirects: 5,
          baseURL: afyLoggerUrl,
        };
      },
    }),
  ],
  providers: [AfyLoggerService],
  exports: [AfyLoggerService],
})
export default class AfyLoggerModule {}
