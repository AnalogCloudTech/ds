import { Body, Controller, Post } from '@nestjs/common';
import { FacebookService } from './facebook.service';
import { CreateFacebookDto } from './dto/create-facebook.dto';
import { FacebookDomain } from './domain/facebook.domain';
import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';

@Controller({ path: 'social-media/facebook', version: '1' })
export class FacebookController {
  constructor(private readonly facebookService: FacebookService) {}

  @Serialize(FacebookDomain)
  @Post()
  async create(
    @Body() createFacebookDto: CreateFacebookDto,
  ): Promise<FacebookDomain> {
    return this.facebookService.create(createFacebookDto);
  }
}
