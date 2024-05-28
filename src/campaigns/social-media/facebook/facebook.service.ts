import { Injectable } from '@nestjs/common';
import { CreateFacebookDto } from './dto/create-facebook.dto';
import { Model } from 'mongoose';
import { api, setAccessToken } from 'fb';
import { FacebookDocument } from './schemas/facebook.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookService {
  constructor(
    @InjectModel('Facebook')
    private readonly facebookModel: Model<FacebookDocument>,
    private readonly configService: ConfigService,
  ) {}

  async create(createFacebookDto: CreateFacebookDto) {
    setAccessToken(this.configService.get('socialMedia.facebook.token'));
    const response = await api(
      `/${this.configService.get('socialMedia.facebook.developerId')}/photos`,
      'POST',
      {
        url: createFacebookDto.photo,
        message: createFacebookDto.message,
      },
    );
    if (response.error) {
      return response.error;
    }
    const savedFbPost = new this.facebookModel(createFacebookDto);
    return savedFbPost.save();
  }
}
