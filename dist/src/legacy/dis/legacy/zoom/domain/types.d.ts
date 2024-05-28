import { SchemaId } from '@/internal/types/helpers';
export type ZoomId = SchemaId;
export interface ZoomAwsSignedUrl {
    preSignedUrl: string;
    message: string;
}
