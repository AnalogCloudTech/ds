import { GenericRepository } from '@/internal/common/repository/generic.repository';
import {
  EmailHistory,
  EmailHistoryDocument,
} from '@/campaigns/email-campaigns/email-history/schemas/email-history.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

export class EmailHistoryRepository extends GenericRepository<EmailHistoryDocument> {
  constructor(
    @InjectModel(EmailHistory.name)
    protected readonly model: Model<EmailHistoryDocument>,
  ) {
    super(model);
  }

  async count(filter: FilterQuery<EmailHistory>): Promise<number> {
    return this.model.countDocuments(filter);
  }
}
