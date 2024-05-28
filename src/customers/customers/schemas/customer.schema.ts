import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AccountType, SMSPreferences, Status, Url } from '../domain/types';
import { Customer as DomainCustomer } from '../domain/customer';
import { CastableTo } from '@/internal/common/utils';
import { CreateAttributesDto } from '../dto/attributesDto';

class BookPreferences {
  phone: string;
  name: string;
  email: string;
}

export class LandingPageWebsite {
  type: 'GUIDE' | 'BOOK';
  link: string;
  guideId: string;
}

class LandingPageProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  brokerAddress: string;
  brokerLogo: string;
  generatedWebsites: LandingPageWebsite[];
}

class FlippingBookPreferences {
  publicationId?: string;
  publicationName?: string;
  publicationUrl?: string;
  rawFileUrl?: string;
  permanentPublicationId?: string;
  permanentPublicationName?: string;
  permanentPublicationUrl?: string;
  permanentRawFileUrl?: string;
}

class Address {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

class Attributes extends CreateAttributesDto {}

const defaultSMSPreferences: SMSPreferences = {
  schedulingCoachReminders: false,
};

@Schema({ timestamps: true, collection: 'ds__customers' })
export class Customer extends CastableTo<DomainCustomer> {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  phone: string;

  @Prop({ index: true })
  hubspotId: string;

  @Prop({ index: true })
  stripeId: string;

  @Prop({ index: true })
  chargifyId: string;

  @Prop({ type: BookPreferences })
  bookPreferences: BookPreferences;

  @Prop({ type: LandingPageProfile })
  landingPageProfile: LandingPageProfile;

  @Prop()
  billing: Address;

  @Prop({
    type: String,
    required: true,
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @Prop({ type: Attributes, default: null, required: false })
  attributes: Attributes;

  @Prop({ type: FlippingBookPreferences, required: false, default: {} })
  flippingBookPreferences?: FlippingBookPreferences;

  @Prop({ required: false, default: '' })
  avatar: string;

  @Prop({ type: Object, default: defaultSMSPreferences })
  smsPreferences: SMSPreferences;

  @Prop({
    type: String,
    required: false,
    default: AccountType.REALTOR,
    enum: AccountType,
  })
  accountType: AccountType;
}

export type CustomerDocument = HydratedDocument<Customer>;
export const CustomerSchema = SchemaFactory.createForClass(Customer);
