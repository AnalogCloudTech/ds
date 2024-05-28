import { IsString, IsNotEmpty } from 'class-validator';
export class FormFields {
  @IsString()
  objectTypeId: string;

  @IsString()
  name: string;

  @IsNotEmpty()
  value: string | number | boolean;
}

export class FormContext {
  @IsString()
  pageUri: string;

  @IsString()
  pageName: string;
}
export class FormSubmissionDto {
  @IsString()
  portalId: string;

  @IsString()
  formId: number;

  @IsNotEmpty()
  fields: FormFields[];

  @IsNotEmpty()
  context: FormContext;
}
