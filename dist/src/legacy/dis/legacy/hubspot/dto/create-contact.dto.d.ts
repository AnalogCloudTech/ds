export declare class CreateContactDto {
    firstname?: string;
    lastname?: string;
    afy_password?: string;
    email: string;
    phone?: string;
}
export declare class UpdateContactDto {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    textMessageOptIn?: boolean;
}
