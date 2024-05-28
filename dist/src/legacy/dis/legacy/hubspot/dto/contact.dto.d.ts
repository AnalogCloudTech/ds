export declare class ContactDto {
    firstname?: string;
    lastname?: string;
    afy_password?: string;
    afy_password_encrypted?: string;
    afy_customer_login_token?: string;
    afy_customer_profile_image_url?: string;
    email: string;
    phone?: string;
    account_type?: string;
    address?: string;
    country?: string;
    state?: string;
    city?: string;
    zip?: string;
    afy_active?: string;
    afy_booklist?: string;
    status?: string;
}
export declare class UpdateAfyPasswordDto {
    email: string;
    password: string;
    passwordConfirmation: string;
    encryptedPassword: string;
}
export declare class UpdateProfileAvatarDto {
    email: string;
    avatar: string;
}
