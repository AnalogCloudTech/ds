import { DataObject } from '@/cms/cms/types/common';

export function flattenCmsObject<T>(object: DataObject<T>): T {
  return {
    id: object.id,
    ...object.attributes,
  };
}
