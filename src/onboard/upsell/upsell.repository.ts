import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TripWireUpsell,
  TWUpsellDocument,
} from '@/onboard/upsell/schemas/tw-upsell.schema';
import { CreateUpsellReportDto } from '@/onboard/upsell/dto/create-upsell-report.dto';

export class TwUpsellRepository extends GenericRepository<TWUpsellDocument> {
  constructor(
    @InjectModel(TripWireUpsell.name)
    protected readonly model: Model<TWUpsellDocument>,
  ) {
    super(model);
  }

  findByIds(ids: string[]) {
    return this.model.find({ _id: { $in: ids } });
  }

  storeMany(data: CreateUpsellReportDto[]) {
    return this.model.insertMany(data);
  }
}
