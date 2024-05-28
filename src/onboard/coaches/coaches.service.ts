import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { CreateCoachDto } from './dto/create-coach.dto';
import { Coach, CoachDocument } from './schemas/coach.schema';
import { UpdateCoachDto } from './dto/update-coach.dto';
import {
  PaginatorSchema,
  PaginatorSchematicsInterface,
} from '@/internal/utils/paginator';
import { EmailRemindersService } from '@/onboard/email-reminders/email-reminders.service';
import { SchemaId } from '@/internal/types/helpers';
import { CoachId } from '@/onboard/coaches/domain/types';
import { CoachesRepository } from '@/onboard/coaches/coaches.repository';
import { SEARCH_UNIQUE_FIELD_DEFAULT_LIMIT } from '@/internal/common/repository/types';

@Injectable()
export class CoachesService {
  constructor(
    @InjectModel(Coach.name)
    private model: Model<CoachDocument>,
    private readonly emailRemindersService: EmailRemindersService,
    private readonly repository: CoachesRepository,
  ) {}

  async create(dto: CreateCoachDto): Promise<CoachDocument> {
    const result = await new this.model(dto).save();
    return result;
  }

  async find(id: string): Promise<CoachDocument> {
    const result = await this.model.findById(id);
    return result;
  }

  async findByOwnerId(id: string): Promise<CoachDocument> {
    const filter: FilterQuery<CoachDocument> = {
      hubspotId: id,
      enabled: true,
    };
    return this.model.findOne(filter);
  }

  async getNextCoachInRR(
    coachesToSkip: Array<CoachId> = [],
  ): Promise<CoachDocument | null> {
    const filter: FilterQuery<CoachDocument> = {
      _id: { $nin: coachesToSkip },
      enabled: true,
    };
    const options: QueryOptions = {
      sort: { schedulingPoints: 'asc' },
    };

    return this.model.findOne(filter, {}, options);
  }

  async incrementScheduling(id: SchemaId): Promise<CoachDocument> {
    return this.model.findOneAndUpdate(
      { _id: id },
      { $inc: { schedulingPoints: 1 } },
    );
  }

  async remove(id: string): Promise<CoachDocument> {
    try {
      await this.emailRemindersService.removeAllRemindersFromCoach(id);
      return this.model.findByIdAndRemove(id).exec();
    } catch (err) {
      if (err instanceof Error) {
        throw new HttpException(
          { ...err, message: 'Error while remove coach | reminders' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async update(id: string, dto: UpdateCoachDto): Promise<CoachDocument> {
    const result = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!result) {
      throw new HttpException(
        { message: 'coach not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }

  async findAllPaginated(
    page: number,
    perPage: number,
  ): Promise<PaginatorSchematicsInterface<CoachDocument>> {
    const total = await this.model.find().countDocuments().exec();
    const skip = page * perPage;
    const coaches = await this.model
      .find()
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: 'desc' })
      .exec();
    return PaginatorSchema.build(total, coaches, page, perPage);
  }

  async findOne(id: string): Promise<CoachDocument> {
    return this.model.findById(id);
  }

  async findByEmail(email: string): Promise<CoachDocument> {
    return this.model.findOne({ email });
  }

  async count(filterQuery?: FilterQuery<CoachDocument>): Promise<number> {
    return this.model.countDocuments(filterQuery).exec();
  }

  async filter(filterQuery?: FilterQuery<CoachDocument>) {
    return this.model.find(filterQuery).exec();
  }

  async searchUniqueField(
    keyword: string,
    field: string,
    limit = SEARCH_UNIQUE_FIELD_DEFAULT_LIMIT,
  ): Promise<string[]> {
    return this.repository.searchUniqueField(keyword, field, limit);
  }
}
