import { Module } from '@nestjs/common';
import { CustomerEventsService } from './customer-events.service';
import { CustomerEventsController } from './customer-events.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CustomerEvent,
  CustomerEventSchema,
} from '@/customers/customer-events/schemas/customer-events.schema';
import { CustomerEventsRepository } from '@/customers/customer-events/repositories/customer-events.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CustomerEvent.name, schema: CustomerEventSchema },
    ]),
  ],
  controllers: [CustomerEventsController],
  providers: [CustomerEventsService, CustomerEventsRepository],
  exports: [CustomerEventsService, CustomerEventsRepository],
})
export class CustomerEventsModule {}
