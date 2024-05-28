import { EsQueryType, LandingPageQueryType } from './dto/analytics.dto';
export declare class AnalyticsConstants {
    static getLeadsElasticsearchRequest(emails: string[], pageNumber: number, pageSize: number): {
        size: number;
        from: number;
        query: {
            bool: {
                must: ({
                    terms: {
                        'customerEmail.keyword': string[];
                    };
                    exists?: undefined;
                } | {
                    exists: {
                        field: string;
                    };
                    terms?: undefined;
                })[];
            };
        };
        fields: string[];
        _source: boolean;
    };
    static getBookLeadCountElasticsearchRequest(emails: string[]): EsQueryType;
    static getBookReadCountElasticsearchRequest(emails: string[], startDate: string, endDate: string): EsQueryType;
    static getBookVisitCountElasticsearchRequest(emails: string[], startDate: string, endDate: string): EsQueryType;
    static getLandingPageReportsElasticsearchRequest({ q, sort, size, }: {
        q?: string;
        sort?: string;
        size: any;
    }): LandingPageQueryType;
    static getLandingPageVisitsBookName(startDate: string, endDate: string, bookName: string, emails: string[]): {
        query: {
            bool: {
                must: ({
                    terms: {
                        'customerEmail.keyword': string[];
                    };
                    range?: undefined;
                    match?: undefined;
                    exists?: undefined;
                } | {
                    range: {
                        usageDate: {
                            gte: string;
                            lte: string;
                        };
                    };
                    terms?: undefined;
                    match?: undefined;
                    exists?: undefined;
                } | {
                    match: {
                        appSection: string;
                        appAction?: undefined;
                    };
                    terms?: undefined;
                    range?: undefined;
                    exists?: undefined;
                } | {
                    match: {
                        appAction: string;
                        appSection?: undefined;
                    };
                    terms?: undefined;
                    range?: undefined;
                    exists?: undefined;
                } | {
                    exists: {
                        field: string;
                    };
                    terms?: undefined;
                    range?: undefined;
                    match?: undefined;
                })[];
            };
        };
        aggs: {
            types_count: {
                value_count: {
                    field: string;
                };
            };
        };
        _source: boolean;
    };
    static getLeadsCountBookName(bookName: string, emails: string[]): {
        query: {
            bool: {
                must: ({
                    terms: {
                        'customerEmail.keyword': string[];
                    };
                    range?: undefined;
                    match?: undefined;
                    exists?: undefined;
                } | {
                    range: {
                        usageDate: {
                            gte: string;
                            lte: string;
                        };
                    };
                    terms?: undefined;
                    match?: undefined;
                    exists?: undefined;
                } | {
                    match: {
                        appSection: string;
                    };
                    terms?: undefined;
                    range?: undefined;
                    exists?: undefined;
                } | {
                    exists: {
                        field: string;
                    };
                    terms?: undefined;
                    range?: undefined;
                    match?: undefined;
                })[];
            };
        };
        aggs: {
            types_count: {
                value_count: {
                    field: string;
                };
            };
        };
        _source: boolean;
    };
    static getBookReadsBookName(startDate: string, endDate: string, bookName: string, emails: string[]): {
        query: {
            bool: {
                must: ({
                    terms: {
                        'customerEmail.keyword': string[];
                    };
                    range?: undefined;
                    match?: undefined;
                    exists?: undefined;
                } | {
                    range: {
                        usageDate: {
                            gte: string;
                            lte: string;
                        };
                    };
                    terms?: undefined;
                    match?: undefined;
                    exists?: undefined;
                } | {
                    match: {
                        appSection: string;
                        appAction?: undefined;
                    };
                    terms?: undefined;
                    range?: undefined;
                    exists?: undefined;
                } | {
                    match: {
                        appAction: string;
                        appSection?: undefined;
                    };
                    terms?: undefined;
                    range?: undefined;
                    exists?: undefined;
                } | {
                    exists: {
                        field: string;
                    };
                    terms?: undefined;
                    range?: undefined;
                    match?: undefined;
                })[];
            };
        };
        aggs: {
            types_count: {
                value_count: {
                    field: string;
                };
            };
        };
        _source: boolean;
    };
    static getEmailCampaignStatistics(emails: string[]): EsQueryType;
    static getOnDemandEmailStatistics(emails: string[]): EsQueryType;
    static getEmailHistoryStaticsFromMessageIds(messageIds: Array<string>): EsQueryType;
}
