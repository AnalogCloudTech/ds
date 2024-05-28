import { Email } from '@/cms/cms/types/email';
export type Content = {
    name: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
    emails?: Email[];
};
