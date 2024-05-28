import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { INestApplication, VersioningType } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { AWSConfigBootstrap } from '@/internal/bootstrap/aws';
import { LoggerBootstrap } from '@/internal/bootstrap/logger';
import { LoggerInterceptor } from '@/internal/common/interceptors/logger.interceptor';
import helmet from 'helmet';
async function ServicesBootstrap(app: INestApplication) {
  await LoggerBootstrap(app);
  await AWSConfigBootstrap(app);
}

export async function AppBootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    origin: '*',
    // origin:
    //   configService.get<string>('app.env') === 'production'
    //     ? /\.authorify\.com$/
    //     : '*',
    allowedHeaders: ['*'],
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.use(helmet());
  app.useGlobalInterceptors(new LoggerInterceptor());

  const appPort = configService.get<string>('app.port');
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await ServicesBootstrap(app);
  await app.listen(appPort);
}
