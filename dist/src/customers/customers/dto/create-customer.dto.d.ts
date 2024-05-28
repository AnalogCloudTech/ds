import { Address } from '../domain/address';
import { Attributes } from '../domain/attributes';
import { AccountType } from '@/customers/customers/domain/types';
export declare class CreateCustomerDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    billing: Address;
    attributes: Attributes;
    avatar?: string;
    password?: string;
    chargifyToken?: string;
    accountType?: AccountType;
    smsPreferences: {
        schedulingCoachReminders: boolean;
    };
}
