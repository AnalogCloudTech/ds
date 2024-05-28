import { ContentEmail } from '@/campaigns/email-campaigns/contents/domain/types';
export declare class Content {
    id: number;
    name: string;
    image: string;
    emails: ContentEmail[];
}
