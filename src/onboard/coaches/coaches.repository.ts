import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CoachDocument, Coach } from '@/onboard/coaches/schemas/coach.schema';

@Injectable()
export class CoachesRepository extends GenericRepository<CoachDocument> {
  constructor(
    @InjectModel(Coach.name)
    protected readonly model: Model<CoachDocument>,
  ) {
    super(model);
  }
}
