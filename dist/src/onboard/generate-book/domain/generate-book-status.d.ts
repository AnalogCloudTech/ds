import { Status as StatusEnum } from './types';
declare class Pages {
    read: string;
    landing: string;
}
declare class Links {
    book: string;
    pages: Pages;
}
declare class Status {
    book: StatusEnum;
    pages: StatusEnum;
}
export declare class GenerateBookStatus {
    name: string;
    title: string;
    bookId: string;
    links: Links;
    status: Status;
}
export {};
