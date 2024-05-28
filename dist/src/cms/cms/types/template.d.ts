import { DataObject, ResponseArrayObject, ResponseObject } from './common';
import { Media } from './media';
export declare class Template {
    id?: number;
    name: string;
    content: string;
    bodyContent: string;
    templateTitle: string;
    imageUrl: string;
    subject: string;
    image: ResponseObject<DataObject<Media>>;
    emailTemplates?: ResponseArrayObject<DataObject<Template>>;
    customerId?: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}
export declare class CreateTemplate {
    name: string;
    content: string;
    subject: string;
    bodyContent?: string;
    templateTitle?: string;
    imageUrl?: string;
    emailTemplate?: number;
}
export declare class TemplateDetails {
    id: number;
    customerTemplateId?: string;
    name: string;
    content: string;
    subject: string;
    imageUrl: string;
    createdAt: string;
    customerId?: string;
    templateTitle?: string;
    bodyContent?: string;
    customTemplate?: TemplateDetails;
}
