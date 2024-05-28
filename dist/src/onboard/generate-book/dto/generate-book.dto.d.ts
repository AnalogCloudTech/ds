declare class Book {
    bookId: string;
    templateId: string;
    name: string;
    email: string;
    phone: string;
}
export declare class GenerateBookDto {
    email: string;
    book: Book;
    avatarHeadshot?: string;
}
export declare class UpdateProfileAvatarDto {
    avatar: string;
}
export {};
