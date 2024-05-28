import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { SchemaId } from '@/internal/types/helpers';
import {
  ZoomRecording,
  ZoomRecordingDocument,
} from '@/legacy/dis/legacy/zoom/schemas/zoom.schema';
import { InjectModel } from '@nestjs/mongoose';
import { DateTime } from 'luxon';
import { Model } from 'mongoose';

export class ZoomDsRepository extends GenericRepository<ZoomRecordingDocument> {
  constructor(
    @InjectModel(ZoomRecording.name)
    protected readonly model: Model<ZoomRecordingDocument>,
  ) {
    super(model);
  }

  async getUniqueHostMail(email?: string): Promise<string[]> {
    const filter = {
      zoomAppInstantDelete: false,
    };
    if (email) {
      filter['hostEmail'] = email;
    }
    return this.model.distinct('hostEmail', filter);
  }

  async deleteManyRecords(data?: SchemaId[]) {
    if (!data || data.length === 0) {
      return null;
    }
    const filter = { _id: { $in: data } };
    const zoomRecData = {
      deletedAt: DateTime.now(),
    };
    return this.model.updateMany(filter, zoomRecData);
  }
}
