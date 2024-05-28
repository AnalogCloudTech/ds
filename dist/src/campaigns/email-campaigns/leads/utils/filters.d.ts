import { FilterQuery } from 'mongoose';
import { LeadDocument } from '@/campaigns/email-campaigns/leads/schemas/lead.schema';
import { SchemaId } from '@/internal/types/helpers';
export declare function buildFilterQueryForCampaignLeads(customerId: SchemaId, customerEmail: string, segments: Array<number>, allSegments?: boolean): FilterQuery<LeadDocument>;
