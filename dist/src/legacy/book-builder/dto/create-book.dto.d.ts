import { Types } from 'mongoose';
export declare class CreateBookDto {
    bookId: Types.ObjectId;
    title: string;
    landingPageUrl?: string;
    digitalBookUrl?: string;
    customLandingPageUrl?: string;
}
