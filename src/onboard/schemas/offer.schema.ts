import { CastableTo } from '@/internal/common/utils';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  HydratedDocument,
  SchemaTimestampsConfig,
  SchemaTypes,
} from 'mongoose';
import { ContractedOffer, Offer as DomainOffer } from '../domain/offer';
import { ProductDocument } from '@/onboard/products/schemas/product.schema';
import {
  AccountType,
  BookOptionId,
  BookPackageId,
  OfferCode,
  OfferId,
  OfferImageUrl,
  OfferType,
  ProductId,
  WebinarImageUrl,
} from '../domain/types';
import { BookOptionDocument } from './book-option.schema';

class Webinar {
  id: string;

  title: string;

  description: string;

  image: WebinarImageUrl;

  caption: string;
}

class Addon {
  offer: OfferId;

  requirements: string;
}

class ProductInfo {
  title: string;
  price: string;
}

export class Workflow {
  place_order: string[];
  addon: string[];
  schedule_coaching: string[];
  training_webinar: string[];
  book_details: string[];
  your_book: string[];
}

@Schema({ timestamps: true, collection: 'ds__onboard__offers' })
export class Offer extends CastableTo<DomainOffer> {
  @Prop({ type: String, unique: true })
  code: OfferCode;

  @Prop()
  credits: number;

  @Prop()
  trial: number;

  @Prop()
  packages: BookPackageId[];

  @Prop()
  packagesCA: BookPackageId[];

  @Prop()
  title: string;

  @Prop({ ref: 'Product', type: [SchemaTypes.ObjectId] })
  products: ProductId[] | ProductDocument[];

  @Prop()
  productInfo: ProductInfo[];

  @Prop()
  description1: string;

  @Prop()
  description2: string;

  @Prop()
  whatsIncluded: string[];

  @Prop({ ref: 'BookOption', type: [SchemaTypes.ObjectId] })
  bookOptions: BookOptionId[] | BookOptionDocument[];

  @Prop({ ref: 'BookOption', type: [SchemaTypes.ObjectId] })
  bookOptionsCA: BookOptionId[] | BookOptionDocument[];

  @Prop({ ref: 'BookOption', type: [SchemaTypes.ObjectId], default: [] })
  nonHeadshotBookOptions: BookOptionId[] | BookOptionDocument[];

  @Prop({ ref: 'BookOption', type: [SchemaTypes.ObjectId], default: [] })
  nonHeadshotBookOptionsCA: BookOptionId[] | BookOptionDocument[];

  @Prop({ type: String })
  image: OfferImageUrl;

  @Prop()
  webinar: Webinar;

  @Prop({ type: Object, default: {} })
  addons: Addon[];

  @Prop({ type: String, enum: OfferType })
  type: OfferType;

  @Prop()
  workFlow: Workflow;

  @Prop()
  steps: string[];

  @Prop()
  value: number;

  @Prop({ type: String, enum: AccountType, default: AccountType.REALTOR })
  accountType: AccountType;

  @Prop({ default: null })
  hubspotListId: number;

  @Prop({ default: false })
  skipOnboarding: boolean;

  @Prop({ default: [] })
  paymentOptions?: ContractedOffer[];

  @Prop({ default: 0 })
  freeBooks: number;
}

export type OfferDocument = HydratedDocument<Offer> & SchemaTimestampsConfig;
export const OfferSchema = SchemaFactory.createForClass(Offer).index({
  type: 1,
  code: 1,
});
