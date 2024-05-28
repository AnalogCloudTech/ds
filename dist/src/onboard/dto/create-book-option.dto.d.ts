import { BookOptionImageUrl } from '../domain/types';
export declare class CreateBookOptionDto {
    title: string;
    bookId: string;
    templateId: string;
    image: BookOptionImageUrl;
}
