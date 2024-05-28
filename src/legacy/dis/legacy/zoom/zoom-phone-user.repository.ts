import { GenericRepository } from '@/internal/common/repository/generic.repository';
import {
  ZoomPhoneUser,
  ZoomPhoneUserDocument,
} from '@/legacy/dis/legacy/zoom/schemas/zoom-phone-user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ZoomPhoneUserRepository extends GenericRepository<ZoomPhoneUserDocument> {
  constructor(
    @InjectModel(ZoomPhoneUser.name)
    protected readonly model: Model<ZoomPhoneUserDocument>,
  ) {
    super(model);
  }

  async getUniqueHostMail(email?: string): Promise<string[]> {
    const queryEmail = email ? { email: email } : null;
    return this.model.distinct('email', queryEmail);
  }
}
