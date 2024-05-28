import { config as awsConfig } from 'aws-sdk';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export async function AWSConfigBootstrap(app: INestApplication) {
  const configService = app.get<ConfigService>(ConfigService);

  awsConfig.update({
    accessKeyId: configService.get('aws.accessKeyId'),
    secretAccessKey: configService.get('aws.secretAccessKey'),
    region: configService.get('aws.region'),
  });
}
