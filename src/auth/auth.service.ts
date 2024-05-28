import {
  HttpException,
  HttpStatus,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { ApiKeysService } from '@/auth/api-keys/api-keys.service';
import { ApiKey } from '@/auth/api-keys/schemas/api-key.schema';
import { JwtService } from '@nestjs/jwt';
import { CustomersService } from '@/customers/customers/customers.service';
import { PaymentChargifyService } from '@/payments/payment_chargify/payments.service';
import { planTypeKeys, PlanTypes } from '@/payments/payment_chargify/types';

export const API_KEY_PREFIX = 'afy-api-key';
export const IS_PUBLIC_KEY = 'isPublic';
export const IS_APIKEY_ONLY_KEY = 'isApiKeyOnly';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ApiKeyOnly = () => SetMetadata(IS_APIKEY_ONLY_KEY, true);

@Injectable()
export class AuthService {
  constructor(
    private readonly apiKeysService: ApiKeysService,
    private readonly jwtService: JwtService,
    private readonly customersService: CustomersService,
    private readonly paymentChargifyService: PaymentChargifyService,
  ) {}

  validateApiKey(key: string): Promise<ApiKey> {
    return this.apiKeysService.findByKey(key);
  }

  login(user: any) {
    const payload = { sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async buildSubscriptionsTypeResponse(email: string) {
    const customer = await this.customersService.findByEmail(email);

    if (!customer) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }

    const planTypes =
      await this.paymentChargifyService.checkCustomerSubscriptionType(customer);

    return this.convertToPlanValues(planTypes);
  }

  private convertToPlanValues(planTypes: PlanTypes) {
    type Entries<T> = {
      [K in keyof T]: [K, T[K]];
    }[keyof T][];
    type planTypeValues = Entries<PlanTypes>;

    const values = <planTypeValues>Object.entries(planTypes);

    return <Array<keyof typeof planTypeKeys>>values.reduce(
      (acc: Array<string>, [key, value]) => {
        if (value) {
          acc.push(planTypeKeys[key]);
        }
        return acc;
      },
      [],
    );
  }
}
