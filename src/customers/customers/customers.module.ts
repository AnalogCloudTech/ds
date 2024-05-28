import { forwardRef, Global, Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersService } from './customers.service';
import { CustomersController } from './controllers/customers.controller';
import { Customer, CustomerSchema } from './schemas/customer.schema';
import {
  CustomerSubscription,
  CustomerSubscriptionSchema,
} from './schemas/customer-subscription.schema';
import { DisModule } from '@/legacy/dis/dis.module';
import { DisService } from '@/legacy/dis/dis.service';
import { CustomersRepository } from '@/customers/customers/customers.repository';
import { SubscriptionsRepository } from './repositories/subscriptions.repository';
import { HubspotModule } from '@/legacy/dis/legacy/hubspot/hubspot.module';
import { SubscriptionsController } from './controllers/subscriptions.constroller';
import { SubscriptionsService } from './services/subscriptions.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
      { name: CustomerSubscription.name, schema: CustomerSubscriptionSchema },
    ]),
    DisModule,
    forwardRef(() => HubspotModule),
  ],
  controllers: [CustomersController, SubscriptionsController],
  providers: [
    CustomersService,
    SubscriptionsService,
    DisService,
    CustomersRepository,
    SubscriptionsRepository,
    Logger,
  ],
  exports: [
    CustomersService,
    MongooseModule,
    DisService,
    CustomersRepository,
    SubscriptionsRepository,
  ],
})
export class CustomersModule {}
