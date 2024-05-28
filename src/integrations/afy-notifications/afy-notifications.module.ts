import { Logger, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AfyNotificationsService } from '@/integrations/afy-notifications/afy-notifications.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_CLIENT',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.KAFKA,
            options: {
              consumer: {
                groupId: 'digital-services',
                sessionTimeout: 900000,
                heartbeatInterval: 30000,
                retry: {
                  retries: 3,
                },
              },
              client: {
                clientId: uuidv4() || 'digital-services', // producer-server
                brokers: configService
                  .get<string>('aws.msk.kafka.brokers')
                  .split(','),
                requestTimeout: 90000,
                retry: {
                  retries: 3,
                },
              },
            },
          };
        },
      },
    ]),
  ],
  providers: [AfyNotificationsService, Logger],
  exports: [AfyNotificationsService],
})
export class AfyNotificationsModule {}
