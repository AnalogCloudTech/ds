import { FrontCover, OrderStatus, Address } from '@/guides/orders/domain/guide-orders';
export declare class CreateGuideOrderDto {
    frontCover: FrontCover[];
    practiceName: string;
    practiceAddress: Address;
    practicePhone: string;
    practiceLogo: string;
    practiceWebsite: string;
    practiceEmail: string;
    guideId: string;
    guideName: string;
    quantity: number;
    thumbnail: string;
    landingPage?: string;
    readPage?: string;
    shippingAddress: Address;
    sessionId?: string;
}
declare const UpdateGuideDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateGuideOrderDto>>;
export declare class UpdateGuideDto extends UpdateGuideDto_base {
    status?: OrderStatus;
}
export {};
