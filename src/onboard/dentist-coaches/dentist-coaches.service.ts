import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { CreateDentistCoachDto } from './dto/create-dentist-coach.dto';
import {
  DentistCoach,
  DentistCoachDocument,
} from './schemas/dentist-coach.schema';
import { UpdateDentistCoachDto } from './dto/update-dentist-coach.dto';
import {
  PaginatorSchema,
  PaginatorSchematicsInterface,
} from '@/internal/utils/paginator';
import { EmailRemindersService } from '@/onboard/email-reminders/email-reminders.service';
import { SchemaId } from '@/internal/types/helpers';
import { CoachId } from '@/onboard/coaches/domain/types';

@Injectable()
export class DentistCoachesService {
  constructor(
    @InjectModel(DentistCoach.name)
    private model: Model<DentistCoachDocument>,
    private readonly emailRemindersService: EmailRemindersService,
  ) {}

  async create(dto: CreateDentistCoachDto): Promise<DentistCoachDocument> {
    const result = await new this.model(dto).save();
    return result;
  }

  async find(id: string): Promise<DentistCoachDocument> {
    const result = await this.model.findById(id);
    return result;
  }

  async findByOwnerId(id: string): Promise<DentistCoachDocument> {
    const filter: FilterQuery<DentistCoachDocument> = {
      hubspotId: id,
      enabled: true,
    };
    return this.model.findOne(filter);
  }

  async getNextCoachInRR(
    coachesToSkip: Array<CoachId> = [],
  ): Promise<DentistCoachDocument | null> {
    const filter: FilterQuery<DentistCoachDocument> = {
      _id: { $nin: coachesToSkip },
      enabled: true,
    };
    const options: QueryOptions = {
      sort: { schedulingPoints: 'asc' },
    };

    return this.model.findOne(filter, {}, options);
  }

  async incrementScheduling(id: SchemaId): Promise<DentistCoachDocument> {
    return this.model.findOneAndUpdate(
      { _id: id },
      { $inc: { schedulingPoints: 1 } },
    );
  }

  async remove(id: string): Promise<DentistCoachDocument> {
    try {
      await this.emailRemindersService.removeAllRemindersFromCoach(id);
      return this.model.findByIdAndRemove(id).exec();
    } catch (err) {
      if (err instanceof Error) {
        throw new HttpException(
          { ...err, message: 'Error while remove dentist coach | reminders' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async update(
    id: string,
    dto: UpdateDentistCoachDto,
  ): Promise<DentistCoachDocument> {
    const result = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!result) {
      throw new HttpException(
        { message: 'dentist coach not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }

  async findAllPaginated(
    page: number,
    perPage: number,
  ): Promise<PaginatorSchematicsInterface<DentistCoachDocument>> {
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

  async findOne(id: string): Promise<DentistCoachDocument> {
    return this.model.findById(id);
  }

  async findByEmail(email: string): Promise<DentistCoachDocument> {
    return this.model.findOne({ email });
  }

  async count(
    filterQuery?: FilterQuery<DentistCoachDocument>,
  ): Promise<number> {
    return this.model.countDocuments(filterQuery).exec();
  }
}
