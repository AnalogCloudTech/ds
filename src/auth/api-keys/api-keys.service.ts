import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Uuid4 } from 'id128';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import { ApiKey, ApiKeyDocument } from './schemas/api-key.schema';

@Injectable()
export class ApiKeysService {
  constructor(
    @InjectModel(ApiKey.name)
    private apiKeyModel: Model<ApiKeyDocument>,
  ) {}

  create(createApiKeyDto: CreateApiKeyDto) {
    const key = Uuid4.generate().toCanonical();
    const createdReleaseNote = new this.apiKeyModel({
      ...createApiKeyDto,
      key,
    });
    return createdReleaseNote.save();
  }
  findOne(id: string): Promise<ApiKey> {
    return this.apiKeyModel.findById(id).exec();
  }

  findByKey(key: string): Promise<ApiKey> {
    return this.apiKeyModel.findOne({ key }).exec();
  }

  update(id: string, updateApiKeyDto: UpdateApiKeyDto): Promise<ApiKey> {
    return this.apiKeyModel
      .findByIdAndUpdate(id, updateApiKeyDto, {
        new: true,
      })
      .exec();
  }

  remove(id: string): Promise<ApiKey> {
    return this.apiKeyModel.findByIdAndDelete(id).exec();
  }
}
