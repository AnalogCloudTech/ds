import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersService } from '@/customers/customers/customers.service';
import { LandingPagesController } from './controllers/landing-pages.controller';
import { LandingPagesService } from './services/landing-pages.service';
import { HubspotModule } from '../dis/legacy/hubspot/hubspot.module';
import { LandingPagesRepository } from './repositories/landing-pages.repository';
import { Book, BookSchema } from './schemas/book.schema';
import {
  BookPreviewsSchema,
  BookPreviews,
} from './schemas/book-previews.schema';
import {
  CustomLandingPage,
  CustomLandingPageSchema,
} from './schemas/custom-landing-page.schema';
import { BooksRepository } from './repositories/books.repository';
import { BooksService } from './services/books.service';
import { BooksController } from './controllers/books.controller';
import { BookPreviewsRepository } from './repositories/book-previews.respository';
import { BookPreviewsService } from './services/book-previews.service';
import { BookPreviewsController } from './controllers/book-previews.controller';
import { LoggerWithContext } from '@/internal/utils/logger';
import { ADMIN_CUSTOMER_MILESTONE } from '@/internal/common/contexts';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: BookPreviews.name, schema: BookPreviewsSchema },
      { name: CustomLandingPage.name, schema: CustomLandingPageSchema },
    ]),
    HubspotModule,
  ],
  controllers: [
    LandingPagesController,
    BooksController,
    BookPreviewsController,
  ],
  providers: [
    Logger,
    LandingPagesService,
    CustomersService,
    LandingPagesRepository,
    BooksRepository,
    BookPreviewsRepository,
    BooksService,
    BookPreviewsService,
    LoggerWithContext(ADMIN_CUSTOMER_MILESTONE),
  ],
  exports: [LandingPagesService, BooksService],
})
export class BooksBuilderModule {}
