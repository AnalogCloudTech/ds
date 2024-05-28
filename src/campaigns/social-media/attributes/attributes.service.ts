import { Attributes } from '@/customers/customers/domain/attributes';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import {
  PaginatorSchema,
  PaginatorSchematicsInterface,
} from '@/internal/utils/paginator';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { AttributesDocument } from './schemas/attributes.schemas';

@Injectable()
export class AttributesService {
  constructor(
    @InjectModel(Attributes.name)
    private readonly attributeModel: Model<AttributesDocument>,
  ) {}

  async create(
    customer: CustomerDocument,
    createAttributeDto: CreateAttributeDto,
  ): Promise<AttributesDocument> {
    createAttributeDto.customerId = customer.id;
    const attribute = await new this.attributeModel(createAttributeDto);
    return await attribute.save();
  }

  async findAll(
    page: number,
    perPage: number,
  ): Promise<PaginatorSchematicsInterface> {
    const skip = page * perPage;
    const total = await this.attributeModel.find().countDocuments().exec();
    const campaignList = await this.attributeModel
      .find()
      .skip(skip)
      .limit(perPage)
      .exec();
    return PaginatorSchema.build(total, campaignList, page, perPage);
  }

  async findOne(id: string): Promise<AttributesDocument> {
    return this.attributeModel.findById(id);
  }

  update(
    id: string,
    updateAttributeDto: UpdateAttributeDto,
  ): Promise<AttributesDocument> {
    return this.attributeModel
      .findByIdAndUpdate(id, updateAttributeDto, { new: true })
      .exec();
  }

  remove(id: string): Promise<AttributesDocument> {
    return this.attributeModel.findByIdAndDelete(id).exec();
  }

  findAllByCustomerId(customer: CustomerDocument) {
    return this.attributeModel.find({
      customerId: customer.id,
    });
  }
}
