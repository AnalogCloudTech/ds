import { Module } from '@nestjs/common';
import { WebinarsService } from './webinars.service';
import { WebinarsController } from './webinars.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const baseURL = configService.get<string>('webinar.url');
        return {
          baseURL,
        };
      },
    }),
  ],
  controllers: [WebinarsController],
  providers: [
    WebinarsService,
    {
      provide: 'SHOULD_MOCK_WEBINAR_API',
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get<string>('app.env') || 'development';
        return nodeEnv === 'development';
      },
      inject: [ConfigService],
    },
  ],
})
export class WebinarsModule {}
