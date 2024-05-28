"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsConstants = void 0;
class AnalyticsConstants {
    static getLeadsElasticsearchRequest(emails, pageNumber, pageSize) {
        return {
            size: pageSize,
            from: (pageNumber - 1) * pageSize,
            query: {
                bool: {
                    must: [
                        {
                            terms: {
                                'customerEmail.keyword': emails,
                            },
                        },
                        {
                            exists: {
                                field: 'leadEmail',
                            },
                        },
                    ],
                },
            },
            fields: ['message'],
            _source: false,
        };
    }
    static getBookLeadCountElasticsearchRequest(emails) {
        const esQuery = {
            query: {
                bool: {
                    must: [
                        {
                            range: {
                                usageDate: {
                                    gte: 'now-90d/d',
                                    lte: 'now',
                                },
                            },
                        },
                        {
                            exists: {
                                field: 'leadEmail',
                            },
                        },
                    ],
                },
            },
            aggs: {
                types_count: { value_count: { field: 'leadEmail.keyword' } },
            },
            _source: false,
        };
        if (emails.length) {
            esQuery.query.bool.must.push({
                terms: { 'customerEmail.keyword': emails },
            });
        }
        return esQuery;
    }
    static getBookReadCountElasticsearchRequest(emails, startDate, endDate) {
        const esQuery = {
            query: {
                bool: {
                    must: [
                        {
                            range: {
                                usageDate: {
                                    gte: startDate,
                                    lte: endDate,
                                },
                            },
                        },
                        {
                            match: {
                                appAction: 'read',
                            },
                        },
                        {
                            exists: {
                                field: 'appAction',
                            },
                        },
                    ],
                },
            },
            aggs: {
                types_count: { value_count: { field: 'appAction.keyword' } },
            },
            _source: false,
        };
        if (emails.length) {
            esQuery.query.bool.must.push({
                terms: { 'customerEmail.keyword': emails },
            });
        }
        return esQuery;
    }
    static getBookVisitCountElasticsearchRequest(emails, startDate, endDate) {
        const esQuery = {
            query: {
                bool: {
                    must: [
                        {
                            range: {
                                usageDate: {
                                    gte: startDate,
                                    lte: endDate,
                                },
                            },
                        },
                        {
                            match: {
                                appAction: 'landing',
                            },
                        },
                        {
                            exists: {
                                field: 'appAction',
                            },
                        },
                    ],
                },
            },
            aggs: {
                types_count: { value_count: { field: 'appAction.keyword' } },
            },
            _source: false,
        };
        if (emails.length) {
            esQuery.query.bool.must.push({
                terms: { 'customerEmail.keyword': emails },
            });
        }
        return esQuery;
    }
    static getLandingPageReportsElasticsearchRequest({ q = '', sort = 'desc', size, }) {
        const esQuery = {
            query: {
                bool: {
                    must: [
                        {
                            range: {
                                usageDate: {
                                    gte: 'now-90d/d',
                                    lte: 'now',
                                },
                            },
                        },
                        {
                            match: {
                                appAction: 'landing',
                            },
                        },
                        {
                            exists: {
                                field: 'appAction',
                            },
                        },
                    ],
                },
            },
            aggs: {
                data: {
                    terms: {
                        field: 'customerEmail.keyword',
                        order: { _count: sort },
                        size,
                    },
                    aggs: {
                        platform: {
                            top_hits: {
                                size: 1,
                                _source: {
                                    includes: ['customerId', 'customerEmail'],
                                },
                            },
                        },
                    },
                },
            },
            _source: false,
        };
        if (q.length) {
            esQuery.query.bool.must.push({ query_string: { query: `/${q}/` } });
        }
        return esQuery;
    }
    static getLandingPageVisitsBookName(startDate, endDate, bookName, emails) {
        return {
            query: {
                bool: {
                    must: [
                        {
                            terms: {
                                'customerEmail.keyword': emails,
                            },
                        },
                        {
                            range: {
                                usageDate: {
                                    gte: startDate,
                                    lte: endDate,
                                },
                            },
                        },
                        {
                            match: {
                                appSection: bookName,
                            },
                        },
                        {
                            match: {
                                appAction: 'read',
                            },
                        },
                        {
                            exists: {
                                field: 'appAction',
                            },
                        },
                    ],
                },
            },
            aggs: {
                types_count: { value_count: { field: 'appAction.keyword' } },
            },
            _source: false,
        };
    }
    static getLeadsCountBookName(bookName, emails) {
        return {
            query: {
                bool: {
                    must: [
                        {
                            terms: {
                                'customerEmail.keyword': emails,
                            },
                        },
                        {
                            range: {
                                usageDate: {
                                    gte: 'now-90d/d',
                                    lte: 'now',
                                },
                            },
                        },
                        {
                            match: {
                                appSection: bookName,
                            },
                        },
                        {
                            exists: {
                                field: 'leadEmail',
                            },
                        },
                    ],
                },
            },
            aggs: {
                types_count: { value_count: { field: 'appAction.keyword' } },
            },
            _source: false,
        };
    }
    static getBookReadsBookName(startDate, endDate, bookName, emails) {
        return {
            query: {
                bool: {
                    must: [
                        {
                            terms: {
                                'customerEmail.keyword': emails,
                            },
                        },
                        {
                            range: {
                                usageDate: {
                                    gte: startDate,
                                    lte: endDate,
                                },
                            },
                        },
                        {
                            match: {
                                appSection: bookName,
                            },
                        },
                        {
                            match: {
                                appAction: 'read',
                            },
                        },
                        {
                            exists: {
                                field: 'appAction',
                            },
                        },
                    ],
                },
            },
            aggs: {
                types_count: { value_count: { field: 'appAction.keyword' } },
            },
            _source: false,
        };
    }
    static getEmailCampaignStatistics(emails) {
        const esQuery = {
            query: {
                bool: {
                    must: [
                        {
                            range: {
                                usageDate: {
                                    gte: 'now-90d/d',
                                    lte: 'now',
                                },
                            },
                        },
                    ],
                },
            },
            aggs: {
                emailCampaigns: {
                    terms: {
                        field: 'name.keyword',
                    },
                    aggs: {
                        sent: {
                            value_count: {
                                field: 'name.keyword',
                            },
                        },
                    },
                },
            },
            _source: false,
        };
        if (emails.length) {
            esQuery.query.bool.must.push({
                terms: { 'customerEmail.keyword': emails },
            });
        }
        return esQuery;
    }
    static getOnDemandEmailStatistics(emails) {
        const esQuery = {
            query: {
                bool: {
                    must: [
                        {
                            range: {
                                usageDate: {
                                    gte: 'now-90d/d',
                                    lte: 'now',
                                },
                            },
                        },
                    ],
                },
            },
            aggs: {
                onDemandEmail: {
                    terms: {
                        field: 'customerEmail.keyword',
                    },
                    aggs: {
                        sent: {
                            value_count: {
                                field: 'customerEmail.keyword',
                            },
                        },
                    },
                },
            },
            _source: false,
        };
        if (emails.length) {
            esQuery.query.bool.must.push({
                terms: { 'customerEmail.keyword': emails },
            });
        }
        return esQuery;
    }
    static getEmailHistoryStaticsFromMessageIds(messageIds) {
        return {
            size: 10000,
            query: {
                bool: {
                    must: [
                        {
                            terms: {
                                'rawData.mail.messageId.keyword': messageIds,
                            },
                        },
                    ],
                },
            },
            aggs: {
                eventTypes: {
                    terms: {
                        field: 'rawData.eventType.keyword',
                    },
                },
            },
            _source: true,
        };
    }
}
exports.AnalyticsConstants = AnalyticsConstants;
//# sourceMappingURL=analytics.constants.js.map