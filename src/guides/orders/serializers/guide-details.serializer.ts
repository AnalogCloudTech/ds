import { GuideDetailDocument } from '../schemas/guide-details.schema';
import { Expose } from 'class-transformer';

export class Address {
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export class FrontCover {
  image: string;
  name: string;
  title: string;
}

export class GuideDetailsBaseSerializer {
  @Expose()
  _id: string;

  @Expose()
  customer: string;

  @Expose()
  frontCover: FrontCover[];

  @Expose()
  practiceName: string;

  @Expose()
  practiceAddress: Address;

  @Expose()
  practicePhone: string;

  @Expose()
  practiceEmail: string;

  @Expose()
  practiceLogo: string;

  @Expose()
  practiceWebsite: string;

  @Expose()
  shippingAddress: Address;

  constructor(partial: Partial<GuideDetailDocument>) {
    if (!partial) return;

    const obj = partial.toObject();
    Object.assign(this, {
      ...obj,
      _id: obj._id.toString(),
      customer: obj.customer.toString(),
    });
  }
}
