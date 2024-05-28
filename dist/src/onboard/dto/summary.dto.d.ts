import { GuideOrderDocument } from '@/guides/orders/schemas/guide-orders.schema';
export declare class SummaryDTO {
    scheduleData: string;
    yourBook: {
        title: string;
        digitalBook: string;
        bookWebsite: string;
    };
    printedBooks: number;
    shipTo: {
        address: string;
        street: string;
        country: string;
    };
}
export declare class SummaryGuideDTO {
    scheduleData: string;
    guideOrder: GuideOrderDocument;
    shipTo: {
        address: string;
        street: string;
        country: string;
    };
}
