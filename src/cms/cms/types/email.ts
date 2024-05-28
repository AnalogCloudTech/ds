import { ResponseObject } from '@/cms/cms/types/common';
import { Template } from '@/cms/cms/types/template';

export class Email {
  id: number;
  name: string;
  usesRelativeTime: boolean;
  relativeDays: number;
  absoluteDay: number;
  absoluteMonth: number;
  template?: ResponseObject<Template>;
}
