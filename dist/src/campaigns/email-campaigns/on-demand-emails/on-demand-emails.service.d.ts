import { Logger } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { CreateOnDemandEmailDto } from './dto/create-on-demand-email.dto';
import { UpdateOnDemandEmailDto } from './dto/update-on-demand-email.dto';
import { OnDemandEmail, OnDemandEmailDocument } from './schemas/on-demand-email.schema';
import { Statuses } from '@/campaigns/email-campaigns/on-demand-emails/domain/types';
import { utcTimestampISO8601 } from 'aws-sdk/clients/frauddetector';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { TemplatesService } from '@/campaigns/email-campaigns/templates/templates.service';
import { MessageId } from 'aws-sdk/clients/ses';
import { Lead } from '@/campaigns/email-campaigns/leads/schemas/lead.schema';
import { LeadsService } from '@/campaigns/email-campaigns/leads/leads.service';
import { SegmentsService } from '@/campaigns/email-campaigns/segments/segments.service';
import { Segment } from '@/campaigns/email-campaigns/segments/domain/segment';
import { SES } from 'aws-sdk';
import { SesService } from '@/internal/libs/aws/ses/ses.service';
import { EmailHistoryService } from '@/campaigns/email-campaigns/email-history/email-history.service';
import { SchemaId } from '@/internal/types/helpers';
export declare class OnDemandEmailsService {
    private readonly onDemandEmailModel;
    private readonly templatesService;
    private readonly leadsService;
    private readonly segmentsService;
    private readonly sesService;
    private readonly emailHistoryService;
    private readonly logger;
    constructor(onDemandEmailModel: Model<OnDemandEmailDocument>, templatesService: TemplatesService, leadsService: LeadsService, segmentsService: SegmentsService, sesService: SesService, emailHistoryService: EmailHistoryService, logger: Logger);
    create(customer: CustomerDocument, createOnDemandEmailDto: CreateOnDemandEmailDto): Promise<import("mongoose").Document<unknown, any, OnDemandEmail> & OnDemandEmail & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findAll(user: {
        email: string;
    }): Promise<(import("mongoose").Document<unknown, any, OnDemandEmail> & OnDemandEmail & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findAllPaginated(customer: CustomerDocument, page: number, perPage: number): Promise<PaginatorSchematicsInterface>;
    findOneByUser(customer: CustomerDocument, id: string): Promise<OnDemandEmailDocument>;
    update(id: string, updateOnDemandEmailDto: UpdateOnDemandEmailDto): Promise<import("mongoose").Document<unknown, any, OnDemandEmail> & OnDemandEmail & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    remove(id: string): Promise<OnDemandEmail>;
    getEmailsByStatusAndDate(status: Statuses, dateTime: utcTimestampISO8601): Promise<OnDemandEmailDocument[]>;
    updateStatus(onDemandEmailId: SchemaId, status: Statuses): Promise<OnDemandEmailDocument>;
    setEmailAsDone(onDemandEmailId: SchemaId): Promise<OnDemandEmailDocument>;
    setLeadsUsage(leads: Array<Lead>): Promise<any[]>;
    updateMessageIds(onDemandEmailId: SchemaId, messageIds: Array<MessageId>): Promise<OnDemandEmailDocument>;
    sendBulkEmail(onDemandEmailDocument: OnDemandEmailDocument): Promise<Array<SES.SendBulkTemplatedEmailResponse> | null>;
    canBeChanged(id: string): Promise<boolean>;
    findByMessageId(messageId: string): Promise<OnDemandEmailDocument>;
    getOnDemandEmailLeads(onDemandEmail: OnDemandEmailDocument): Promise<(import("mongoose").Document<unknown, any, Lead> & Lead & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getOnDemandEmailSegments(onDemandEmail: OnDemandEmailDocument): Promise<Array<Segment>>;
    find(filter: FilterQuery<OnDemandEmailDocument>): Promise<Array<OnDemandEmailDocument>>;
    private createEmailHistory;
    private sendToES;
}
