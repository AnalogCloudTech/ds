import { SchemaId } from '@/internal/types/helpers';
import { BadRequestException } from '@nestjs/common';
import { isNumber } from 'class-validator';

export const statusMap = {
  bounce: 'Bounced',
  open: 'Opened',
  rejected: 'Rejected',
  complaint: 'Spam',
  delivery: 'Success',
  unsubscribed: 'Unsubscribed',
  send: 'Sent',
};

export function transformTitle({ obj }: { obj: TitleTransformInput }) {
  return obj.relationType === 'OnDemandEmail'
    ? obj?.relationId?.subject
    : obj?.relationId?.name;
}

export function transformIsUpsell({ value }: { value: string }) {
  switch (value.toLowerCase()) {
    case 'true':
      return true;
    case 'false':
      return false;
    case undefined:
      return undefined;
    default:
      throw new BadRequestException('Value is not boolean');
  }
}

export function transformStatus({ obj }: { obj: { status: string } }): string {
  return (statusMap[obj.status] as string) || '';
}

export function transformSortBy({ value }: { value: string }) {
  if (!value) {
    return {};
  }

  return value.split(',').reduce((acc, curr) => {
    const [key, order] = curr.split(':');

    if (!key || !order) {
      return acc;
    }

    const n = +order;
    acc[key] = isNumber(n) ? n : 1;
    return acc;
  }, {});
}

export function transformType({ obj }: { obj: TypeTransformInput }) {
  return obj.relationType === 'OnDemandEmail'
    ? obj.relationId?.templateName
    : (obj.relationType as TypeTransformRelationType)?.content?.name;
}

export type TitleTransformInput = {
  relationType: string;
  relationId: TitleTransformRelationIdInput;
};

export type TitleTransformRelationIdInput = {
  subject: string;
  name: string;
};

export type TypeTransformInput = {
  relationType: string | TypeTransformRelationType;
  relationId: TypeTransformRelationId;
};

export type TypeTransformRelationType = {
  content: TypeTransformRelationTypeContent;
};

export type TypeTransformRelationTypeContent = {
  name: string;
};

export type TypeTransformRelationId = {
  templateName: string;
};

export type EmailHistoryReport = {
  lead: string;
  status: string;
  relationId: string;
  relationType: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CampaignsIds = {
  _id: SchemaId;
};

export type CampaignsHistoryIds = {
  _id: SchemaId;
};
