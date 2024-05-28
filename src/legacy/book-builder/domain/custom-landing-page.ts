import { Expose } from 'class-transformer';

export class CustomLandingPageDomain {
  @Expose()
  customerId: string;

  @Expose()
  email: string;
}
