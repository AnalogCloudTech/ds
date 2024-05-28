"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksBuilderModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const customers_service_1 = require("../../customers/customers/customers.service");
const landing_pages_controller_1 = require("./controllers/landing-pages.controller");
const landing_pages_service_1 = require("./services/landing-pages.service");
const hubspot_module_1 = require("../dis/legacy/hubspot/hubspot.module");
const landing_pages_repository_1 = require("./repositories/landing-pages.repository");
const book_schema_1 = require("./schemas/book.schema");
const book_previews_schema_1 = require("./schemas/book-previews.schema");
const custom_landing_page_schema_1 = require("./schemas/custom-landing-page.schema");
const books_repository_1 = require("./repositories/books.repository");
const books_service_1 = require("./services/books.service");
const books_controller_1 = require("./controllers/books.controller");
const book_previews_respository_1 = require("./repositories/book-previews.respository");
const book_previews_service_1 = require("./services/book-previews.service");
const book_previews_controller_1 = require("./controllers/book-previews.controller");
const logger_1 = require("../../internal/utils/logger");
const contexts_1 = require("../../internal/common/contexts");
let BooksBuilderModule = class BooksBuilderModule {
};
BooksBuilderModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: book_schema_1.Book.name, schema: book_schema_1.BookSchema },
                { name: book_previews_schema_1.BookPreviews.name, schema: book_previews_schema_1.BookPreviewsSchema },
                { name: custom_landing_page_schema_1.CustomLandingPage.name, schema: custom_landing_page_schema_1.CustomLandingPageSchema },
            ]),
            hubspot_module_1.HubspotModule,
        ],
        controllers: [
            landing_pages_controller_1.LandingPagesController,
            books_controller_1.BooksController,
            book_previews_controller_1.BookPreviewsController,
        ],
        providers: [
            common_1.Logger,
            landing_pages_service_1.LandingPagesService,
            customers_service_1.CustomersService,
            landing_pages_repository_1.LandingPagesRepository,
            books_repository_1.BooksRepository,
            book_previews_respository_1.BookPreviewsRepository,
            books_service_1.BooksService,
            book_previews_service_1.BookPreviewsService,
            (0, logger_1.LoggerWithContext)(contexts_1.ADMIN_CUSTOMER_MILESTONE),
        ],
        exports: [landing_pages_service_1.LandingPagesService, books_service_1.BooksService],
    })
], BooksBuilderModule);
exports.BooksBuilderModule = BooksBuilderModule;
//# sourceMappingURL=books-builder.module.js.map