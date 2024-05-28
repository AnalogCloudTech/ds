import { FilterQuery } from 'mongoose';
import { LeadDocument } from '@/campaigns/email-campaigns/leads/schemas/lead.schema';
import { SchemaId } from '@/internal/types/helpers';

export function buildFilterQueryForCampaignLeads(
  customerId: SchemaId,
  customerEmail: string,
  segments: Array<number>,
  allSegments = false,
): FilterQuery<LeadDocument> {
  const filters: FilterQuery<LeadDocument> = {
    $and: [
      {
        $or: [{ customer: customerId }, { customerEmail: customerEmail }],
      },
      {
        isValid: true,
        unsubscribed: false,
      },
    ],
  };

  if (!allSegments) {
    filters.$and.push({
      $or: [{ segments: { $in: segments } }, { allSegments: true }],
    });
  }

  return filters;
}
