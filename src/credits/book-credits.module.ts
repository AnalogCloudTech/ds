import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import {
  BookCreditSchema,
  BookCreditsOption,
} from './schemas/book-credits.schema';
import { HubspotModule } from '@/legacy/dis/legacy/hubspot/hubspot.module';
import { BookCreditsController } from './book-credits.controller';
import { BookCreditsService } from './book-credits.service';
import { BookCreditsRepository } from './book-credits.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BookCreditsOption.name, schema: BookCreditSchema },
    ]),
    HubspotModule,
  ],
  controllers: [BookCreditsController],
  providers: [BookCreditsService, BookCreditsRepository],
  exports: [BookCreditsService],
})
export class BookCreditsModule {}
