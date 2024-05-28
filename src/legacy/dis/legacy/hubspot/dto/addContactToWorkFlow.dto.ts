import { IsNumber, IsString } from 'class-validator';

export class AddContactToWorkFlowDto {
  @IsString()
  contactEmail: string;

  @IsString()
  workFlowId: string;
}

export class ContactToWorkFlowDto {
  @IsString()
  listId: string;

  @IsString()
  workFlowId: string;
}

export class HsUrlDataDto {
  @IsNumber()
  contactCount: number;

  @IsNumber()
  vidOffset: number;
}
