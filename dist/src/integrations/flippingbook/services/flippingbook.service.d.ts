import { Axios } from 'axios';
interface PublicationResponse {
    success: boolean;
    publication: {
        id: string;
        links: Array<{
            rel: string;
            type: 'GET' | 'POST' | 'DELETE';
            href: string;
        }>;
        state: string;
        seoEnabled: boolean;
        name: string;
        description: string;
        hashId: string;
        lastPdfName: string;
        contentRoot: string;
        canonicalLink: string;
        modificationTime: string;
        creationTime: string;
        isDemoPublication: boolean;
        totalPages: number;
        customizationOptions: {
            password: string;
            hardcoverEnabled: boolean;
            companyLogoEnabled: boolean;
            companyLogoUrl: string;
            rtlEnabled: boolean;
            theme: string;
        };
    };
}
export declare class FlippingBookService {
    private readonly api;
    constructor(api: Axios);
    getPublicationById(publicationId: string): Promise<PublicationResponse>;
    updatePublicationByHashId(hashId: string, payload: {
        url: string;
        name: string;
        description: string;
        domain: string;
    }): Promise<PublicationResponse>;
    getHashIdFromUrl(url: string): string;
}
export {};
