import { SchemaId } from '@/internal/types/helpers';
export declare class Selection {
    page: number;
    formKeyword: string;
    extraHtml?: {
        formKeyword: string;
        htmlReplacer: string;
        dynamicFields: {
            keyword: string;
            value: string;
        }[];
    };
    dynamicFields: {
        keyword: string;
        value: string;
    }[];
}
export type MagazineContent = {
    file: string;
    order: number;
};
export type Replacer = {
    keyword: string;
    value: string;
};
export type Cover = {
    name: string;
    html: string;
    order: number;
    replacers: Replacer[];
};
export type MagazineReportsType = {
    year: string;
    month: string;
    customerInfo: {
        firstName: string;
        lastName: string;
        email: string;
        status: string;
    };
    status: string;
    customer: string;
};
export type CustomerType = {
    firstName: string;
    lastName: string;
    email: string;
    status: string;
};
export type MagazineDataType = {
    id: number;
    name: string;
    html: string;
    displayImage: {
        id: number;
        data: {
            attributes: {
                name: string;
                url: string;
            };
        };
    };
    formKeyword: string;
    defaultText: string;
};
export type MagazinePreviewType = {
    year: number;
    month: string;
    url: string;
    status: string;
    flippingBookUrl: string;
    coverImage: string;
    pageUrl: string;
    bookUrl: string;
    pageStatus: string;
    coversOnlyUrl: string;
    createdAt: Date;
    updatedAt: Date;
    customerInfo: {
        firstName: string;
        lastName: string;
        email: string;
        status: string;
    };
};
export type RmMagazineFilterQuery = {
    year: string;
    month: string;
};
export type RmStatusFilterQuery = {
    year: string;
    month: string;
    status: string;
};
export type MagazineIds = {
    _id: SchemaId;
};
export type MagazineMetricsType = {
    customerInfo: {
        firstName: string;
        lastName: string;
        email: string;
        status: string;
    };
    generatedMagazines: Partial<GeneratedMagazineType>;
    year: string;
    month: string;
    status: string;
    customer: string;
    createdAt: Date;
    updatedAt: Date;
    contentUrl: string;
};
export type GeneratedMagazineType = {
    _id: SchemaId;
    customer: SchemaId;
    magazine: SchemaId;
    url: string;
    status: string;
    active: boolean;
    additionalInformation: string | null;
    isPreview: boolean;
    flippingBookUrl: string;
    coverImage: string;
    pageUrl: string;
    bookUrl: string;
    pageStatus: string;
    coversOnlyUrl: string;
    createdByAutomation: boolean;
    createdAt: Date;
    updatedAt: Date;
};
export type TotalAggregateType = {
    total: number;
};
