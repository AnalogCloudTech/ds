import { DataObject, ResponseArrayObject, ResponseObject } from './common';
import { Media } from './media';
import { Expose } from 'class-transformer';

export class Template {
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

export class CreateTemplate {
  name: string;
  content: string;
  subject: string;
  bodyContent?: string;
  templateTitle?: string;
  imageUrl?: string;
  emailTemplate?: number;
}

export class TemplateDetails {
  @Expose()
  id: number;

  @Expose()
  customerTemplateId?: string;

  @Expose()
  name: string;

  @Expose()
  content: string;

  @Expose()
  subject: string;

  @Expose()
  imageUrl: string;

  @Expose()
  createdAt: string;

  @Expose()
  customerId?: string;

  @Expose()
  templateTitle?: string;

  @Expose()
  bodyContent?: string;

  @Expose()
  customTemplate?: TemplateDetails;
}
