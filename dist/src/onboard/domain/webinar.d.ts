import { WebinarImageUrl } from './types';
export declare class Webinar {
    id?: string;
    title: string;
    description: string;
    image: WebinarImageUrl;
    caption: string;
    slots?: string[];
}
