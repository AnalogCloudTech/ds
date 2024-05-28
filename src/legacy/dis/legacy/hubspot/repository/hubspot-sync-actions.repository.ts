import { Injectable } from '@nestjs/common';
import { GenericRepository } from '@/internal/common/repository/generic.repository';
import {
  HubspotSyncActions,
  HubspotSyncActionsDocument,
} from '@/legacy/dis/legacy/hubspot/schemas/hubspot-sync-actions.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class HubspotSyncActionsRepository extends GenericRepository<HubspotSyncActionsDocument> {
  constructor(
    @InjectModel(HubspotSyncActions.name)
    protected readonly model: Model<HubspotSyncActionsDocument>,
  ) {
    super(model);
  }
}
