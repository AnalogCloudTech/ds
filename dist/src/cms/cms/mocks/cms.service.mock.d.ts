export declare class CmsServiceMock {
    magazineDetails(magazineId: string): {
        id: number;
        attributes: {
            month: string;
            year: string;
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
            frontCoverDesign: {
                id: number;
                name: string;
                html: string;
                formKeyword: string;
            }[];
            frontCoverStrip: {
                id: number;
                name: string;
                html: any;
                formKeyword: string;
            }[];
            pdf: {
                data: {
                    id: number;
                    attributes: {
                        name: string;
                        alternativeText: string;
                        caption: string;
                        width: any;
                        height: any;
                        formats: any;
                        hash: string;
                        ext: string;
                        mime: string;
                        size: number;
                        url: string;
                        previewUrl: any;
                        provider: string;
                        provider_metadata: any;
                        createdAt: string;
                        updatedAt: string;
                    };
                };
            };
            frontInsideCover: {
                id: number;
                name: string;
                html: string;
                formKeyword: string;
            }[];
            backInsideCover: {
                id: number;
                name: string;
                html: any;
                formKeyword: string;
            }[];
            backCover: {
                id: number;
                name: string;
                html: string;
                formKeyword: string;
            }[];
        };
    };
    magazineData(month: string, year: string): {
        id: number;
        attributes: {
            month: string;
            year: string;
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
            frontCoverDesign: {
                id: number;
                name: string;
                html: string;
                formKeyword: string;
            }[];
            frontCoverStrip: {
                id: number;
                name: string;
                html: any;
                formKeyword: string;
            }[];
            pdf: {
                data: {
                    id: number;
                    attributes: {
                        name: string;
                        alternativeText: string;
                        caption: string;
                        width: any;
                        height: any;
                        formats: any;
                        hash: string;
                        ext: string;
                        mime: string;
                        size: number;
                        url: string;
                        previewUrl: any;
                        provider: string;
                        provider_metadata: any;
                        createdAt: string;
                        updatedAt: string;
                    };
                };
            };
            frontInsideCover: {
                id: number;
                name: string;
                html: string;
                formKeyword: string;
            }[];
            backInsideCover: {
                id: number;
                name: string;
                html: any;
                formKeyword: string;
            }[];
            backCover: {
                id: number;
                name: string;
                html: string;
                formKeyword: string;
            }[];
        };
    }[];
}
