import { Public } from '@/auth/auth.service';
import { Paginator, PaginatorTransformPipe } from '@/internal/utils/paginator';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { EmailHistoryService } from './email-history.service';
import parseSNSResponse, { SNSMessage } from './utils/parse-sns-response';
import EmailHistoryFilters, { Filters } from './pipes/filters/filters.pipe';
import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';
import { EmailHistory as EmailHistoryDomain } from '@/campaigns/email-campaigns/email-history/domain/email-history';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';
import { LoggerPayload } from '@/internal/utils/logger';
import { DateTime } from 'luxon';
import { CONTEXT_EMAIL_HISTORY } from '@/internal/common/contexts';
@Controller({
  path: 'email-campaigns/email-history',
  version: '1',
})
export class EmailHistoryController {
  constructor(
    private readonly emailHistoryService: EmailHistoryService,
    @Inject('logger')
    private readonly logger: Logger,
  ) {}

  @Get(':id')
  public async index(@Req() req: any, @Param('id') id: string) {
    return this.emailHistoryService.getEmailHistory(req.user, id);
  }

  @Serialize(EmailHistoryDomain)
  @Get()
  public list(
    @Req() req: any,
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    { page, perPage }: Paginator,
    @Query(EmailHistoryFilters)
    { status, type }: Filters,
  ) {
    return this.emailHistoryService.listEmailHistory(
      req.user,
      page,
      perPage,
      status,
      type,
    );
  }

  @Serialize(EmailHistoryDomain)
  @Get('lead/:lead')
  public async listByLead(
    @Req() req: any,
    @Param('lead') leadId: string,
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    { page, perPage }: Paginator,
    @Query(EmailHistoryFilters)
    { status, types }: Filters,
  ) {
    return this.emailHistoryService.getEmailHistoryByLead(
      req.user,
      leadId,
      page,
      perPage,
      status,
      types,
    );
  }

  @Public()
  @Post()
  async create(@Req() req: Request) {
    try {
      const data: SNSMessage = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject('timeout request'), 5000);

        let data = '';

        req.on('data', (chunk) => {
          data += chunk;
        });

        req.on('end', () => {
          const parsedData = parseSNSResponse(data);
          clearTimeout(timeout);
          resolve(parsedData as any);
        });

        req.on('error', (err) => {
          reject(err);
        });
      });

      if (!data || !data?.eventType) {
        // DON'T remove this logger
        // It is necessary to validate first interation with the
        // SNS subscription
        this.logger.log({
          payload: <LoggerPayload>{
            usageDate: DateTime.now(),
            snsData: data,
          },
          CONTEXT_EMAIL_HISTORY,
        });

        throw new HttpException(
          {
            message: 'failed to load data from SNS',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      this.logger.log({
        payload: {
          message: 'creating email history from raw data',
          rawData: data,
        },
      });

      return this.emailHistoryService.createFromSNS(data);
    } catch (err) {
      throw new HttpException(
        {
          message: err,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
