import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCustomUrlDto } from '../dto/create-custom-url.dto';
import {
  CustomLandingPage,
  CustomLandingPageDocument,
} from '../schemas/custom-landing-page.schema';

@Injectable()
export class LandingPagesRepository {
  constructor(
    @InjectModel(CustomLandingPage.name)
    private readonly model: Model<CustomLandingPageDocument>,
  ) {}

  async findByEmail(email: string): Promise<CustomLandingPageDocument> {
    return this.model.findOne({ email }).exec();
  }

  async create(dto: CreateCustomUrlDto): Promise<CustomLandingPageDocument> {
    return new this.model(dto).save();
  }

  async update(
    id: string,
    dtoUpdate: Partial<CustomLandingPage>,
  ): Promise<CustomLandingPageDocument> {
    const updatedObject = await this.model.findByIdAndUpdate(id, dtoUpdate, {
      new: true,
    });

    if (!updatedObject) {
      throw new HttpException(
        { message: 'Customer not found', method: 'patch' },
        HttpStatus.NOT_FOUND,
      );
    }

    return updatedObject;
  }

  async delete(id: string): Promise<CustomLandingPageDocument> {
    return this.model.findByIdAndDelete(id);
  }
}
