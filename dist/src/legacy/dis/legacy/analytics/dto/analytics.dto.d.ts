export declare class EsQueryType {
    size?: number;
    query: {
        bool: {
            must: ({
                range: {
                    usageDate: {
                        gte: string;
                        lte: string;
                    };
                };
                match?: undefined;
                exists?: undefined;
                terms?: undefined;
            } | {
                match: {
                    appAction: string;
                };
                range?: undefined;
                exists?: undefined;
                terms?: undefined;
            } | {
                exists: {
                    field: string;
                };
                range?: undefined;
                match?: undefined;
                terms?: undefined;
            } | {
                terms: {
                    'customerEmail.keyword': string[];
                };
                exists?: undefined;
                range?: undefined;
                match?: undefined;
            } | {
                terms: {
                    'rawData.mail.messageId.keyword': string[];
                };
                exists?: undefined;
                range?: undefined;
                match?: undefined;
            })[];
        };
    };
    aggs: any;
    _source: boolean;
}
export declare class LandingPageQueryType {
    query: {
        bool: {
            must: ({
                query_string: {
                    query: string;
                };
                range?: undefined;
                match?: undefined;
                exists?: undefined;
            } | {
                query_string?: undefined;
                range: {
                    usageDate: {
                        gte: string;
                        lte: string;
                    };
                };
                match?: undefined;
                exists?: undefined;
            } | {
                query_string?: undefined;
                match: {
                    appAction: string;
                };
                range?: undefined;
                exists?: undefined;
            } | {
                query_string?: undefined;
                exists: {
                    field: string;
                };
                range?: undefined;
                match?: undefined;
            })[];
        };
    };
    aggs: any;
    _source: boolean;
}
