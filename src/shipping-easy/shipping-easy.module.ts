import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Axios } from 'axios';
import { ShippingEasyService } from './shipping-easy.service';
import {
  SHIPPINGEASY_API_KEY,
  SHIPPINGEASY_PROVIDER_NAME,
  SHIPPINGEASY_SECRET_KEY,
} from './constants';
import { HubspotModule } from '@/legacy/dis/legacy/hubspot/hubspot.module';
import { CustomerPropertiesModule } from '@/customers/customer-properties/customer-properties.module';
import { ShippingEasyTriggersController } from '@/shipping-easy/controllers/shipping-easy-triggers.controller';

@Module({
  imports: [HubspotModule, CustomerPropertiesModule],
  controllers: [ShippingEasyTriggersController],
  providers: [
    ShippingEasyService,
    Logger,
    {
      provide: SHIPPINGEASY_PROVIDER_NAME,
      useFactory: (configService: ConfigService): Axios => {
        const baseURL = configService.get<string>('shippingEasy.subDomain');
        return new Axios({ baseURL });
      },
      inject: [ConfigService],
    },
    {
      inject: [ConfigService],
      provide: SHIPPINGEASY_API_KEY,
      useFactory: (configService: ConfigService): string => {
        return configService.get<string>('shippingEasy.apiKey');
      },
    },
    {
      inject: [ConfigService],
      provide: SHIPPINGEASY_SECRET_KEY,
      useFactory: (configService: ConfigService): string => {
        return configService.get<string>('shippingEasy.apiSecret');
      },
    },
  ],
  exports: [ShippingEasyService],
})
export class ShippingEasyModule {}
