import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Axios } from 'axios';
import { Parser } from 'json2csv';
import { DateTime } from 'luxon';
import { BookLeadDto } from './dto/book-lead.dto';
import { AnalyticsConstants } from './analytics.constants';
import { Client } from '@hubspot/api-client';
import { filter, flatten, get, map } from 'lodash';
import { BookStatDto } from './dto/book-stat.dto';
import { LandingReportDto } from '@/legacy/dis/legacy/analytics/dto/landing-report.dto';
import {
  CONTEXT_EMAIL_CAMPAIGNS,
  CONTEXT_GENERAL_ANALYTICS,
  CONTEXT_ON_DEMAND_EMAIL,
} from '@/internal/common/contexts';
import { LeadsService } from '@/campaigns/email-campaigns/leads/leads.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject('HTTP_ANALYTICS')
    private readonly http: Axios,
    private readonly hubspot: Client,
    private readonly logger: Logger,
    private readonly leadService: LeadsService,
  ) {}

  async getBookLeadsCount(
    startDate: string,
    endDate: string,
    customer: CustomerDocument,
  ): Promise<number> {
    return this.leadService.getLeadCountByEmail(
      startDate,
      endDate,
      customer.email,
      customer,
    );
  }

  async getAllStats(
    startDate: string,
    endDate: string,
    customer: CustomerDocument,
    emails?: string[],
  ): Promise<BookStatDto[]> {
    const promises: Promise<BookStatDto>[] = [];
    promises.push(
      this.getBookVisits(startDate, endDate, emails).then((value) => ({
        name: 'Landing Page Visits',
        description: 'Total Visits',
        value,
      })),
    );

    promises.push(
      this.getBookLeadsCount(startDate, endDate, customer).then((value) => ({
        name: 'Landing Page Conversion',
        description: 'Total Leads',
        value,
      })),
    );

    promises.push(
      this.getBookReads(startDate, endDate, emails).then((value) => ({
        name: 'Digital Book Visits',
        description: 'Total Visits',
        value,
      })),
    );

    return Promise.all(promises);
  }

  async getEmailCampaignReports(emails: string[]) {
    const response = await this.http.post(
      `/${CONTEXT_EMAIL_CAMPAIGNS}*/_search`,
      AnalyticsConstants.getEmailCampaignStatistics(emails),
    );
    const buckets = response?.data?.aggregations?.emailCampaigns?.buckets;
    return map(buckets, (bucket) => ({
      campaignName: bucket.key,
      sent: bucket.sent?.value || 0,
    }));
  }

  async getOnDemandEmailReports(emails: string[]) {
    const response = await this.http.post(
      `/${CONTEXT_ON_DEMAND_EMAIL}*/_search`,
      AnalyticsConstants.getOnDemandEmailStatistics(emails),
    );
    const buckets = response?.data?.aggregations?.onDemandEmail?.buckets;
    return map(buckets, (bucket) => ({
      customerEmail: bucket.key,
      sent: bucket.sent?.value || 0,
    }));
  }

  /**
   * This is a technical debt and should not be in this service,
   * it should be moved to the correct place (hubspot service)
   *
   * @deprecated this is a technical debt, please move this to Hubspot module
   */
  async getEmailHistory(email: string) {
    const { body: user } = await this.hubspot.apiRequest({
      method: 'GET',
      path: `/contacts/v1/contact/email/${email}/profile`,
    });
    const profiles = get(user, 'identity-profiles', []);
    const emails = map(profiles, (profile) => {
      const identities = get(profile, ['identities'], []);
      const filtered = filter(identities, (identity) => {
        const type = get(identity, ['type'], '');
        return type === 'EMAIL';
      });

      const mapped = map(filtered, (email) => get(email, ['value'], ''));

      return mapped;
    });
    return flatten(emails);
  }

  async getBookReads(
    startDate: string,
    endDate: string,
    emails?: string[],
    bookName?: string,
  ): Promise<number> {
    const request = bookName
      ? AnalyticsConstants.getBookReadsBookName(
          startDate,
          endDate,
          bookName,
          emails,
        )
      : AnalyticsConstants.getBookReadCountElasticsearchRequest(
          emails,
          startDate,
          endDate,
        );

    const response = await this.http.post(
      '/pagestead-metrics*/_search',
      request,
    );

    return response?.data?.aggregations?.types_count?.value;
  }

  async getBookVisits(
    startDate: string,
    endDate: string,
    emails?: string[],
    bookName?: string,
  ): Promise<number> {
    const request = bookName
      ? AnalyticsConstants.getLandingPageVisitsBookName(
          startDate,
          endDate,
          bookName,
          emails,
        )
      : AnalyticsConstants.getBookVisitCountElasticsearchRequest(
          emails,
          startDate,
          endDate,
        );

    const response = await this.http.post(
      '/pagestead-metrics*/_search',
      request,
    );

    return response?.data?.aggregations?.types_count?.value;
  }

  async getBookLeads(
    emails: string[],
    pageNumber: number,
    pageSize: number,
    formatted?: boolean,
  ): Promise<any> {
    const response = await this.http.post(
      '/pagestead-metrics*/_search',
      AnalyticsConstants.getLeadsElasticsearchRequest(
        emails,
        pageNumber,
        pageSize,
      ),
    );
    const hits = response.data?.hits?.hits;
    const total = response.data?.hits?.total?.value;
    const leadsData = hits.reduce((a: any[], b: any) => {
      a.push(JSON.parse(b?.fields?.message[0]));
      return a;
    }, []);

    const leads = [] as BookLeadDto[];
    leadsData.map((d: any) => {
      let created = '';

      let parsedDate = DateTime.fromISO(d.usageDate);
      if (!parsedDate.isValid) {
        parsedDate = DateTime.fromSQL(d.usageDate);
      }
      if (parsedDate.isValid) {
        if (formatted) {
          created = parsedDate.setLocale('en-us').toLocaleString();
        } else {
          created = parsedDate.toISODate();
        }
      }

      const lead = {
        firstName: d.leadFirstName || '',
        lastName: d.leadLastName || '',
        email: d.leadEmail || '',
        phone: d.leadPhone,
        created,
      };

      leads.push(lead);
    });
    return { leads, total };
  }

  async getBookLeadsReport(emails: string[]) {
    const leads = await this.getBookLeads(emails, 1, 5000, true);

    const fields = [
      { label: 'First name', value: 'firstName' },
      { label: 'Last name', value: 'lastName' },
      { label: 'Email', value: 'email' },
      { label: 'Phone number', value: 'phone' },
      { label: 'Date', value: 'created' },
    ];
    const json2csv = new Parser({ fields });
    return json2csv.parse(leads.leads);
  }

  async getLandingPageReports(filters): Promise<LandingReportDto[]> {
    const response = await this.http.post(
      '/pagestead-metrics*/_search',
      AnalyticsConstants.getLandingPageReportsElasticsearchRequest(filters),
    );
    const landingResponse = response?.data?.aggregations?.data?.buckets;
    return map(landingResponse, (resp) => ({
      count: resp?.doc_count,
      email: resp?.platform?.hits?.hits[0]?._source?.customerEmail,
      name: resp?.platform?.hits?.hits[0]?._source?.customerId,
    }));
  }

  // @TODO this method is temporary and will be removed after we have enough data on MongoDB
  // @TODO don't care about type for now
  async getEmailHistoryByMessageIds(messageIds: Array<string>) {
    const query =
      AnalyticsConstants.getEmailHistoryStaticsFromMessageIds(messageIds);
    try {
      const { data } = await this.http.post('/email-history-*/_search', query);
      return data;
    } catch (err) {
      if (err instanceof Error) {
        const { stack } = err;
        throw new HttpException(
          {
            error: err.message,
            message:
              'Unable to fetch data from elasticsearch email-history index',
            stack,
          },
          HttpStatus.FAILED_DEPENDENCY,
        );
      }
    }
  }

  addLogs(logDetails: any) {
    this.logger.log({ payload: logDetails }, CONTEXT_GENERAL_ANALYTICS);
    return true;
  }

  async landingPageReportsDownload() {
    const leads = await this.getLandingPageReports({ size: 10000 });

    const fields = [
      { label: 'Full Name', value: 'name' },
      { label: 'Email', value: 'email' },
      { label: 'Count', value: 'count' },
    ];
    const json2csv = new Parser({ fields: fields });
    return json2csv.parse(leads);
  }

  async clusterHealth() {
    const url = '_cluster/health';

    return this.http.get(url);
  }
}
