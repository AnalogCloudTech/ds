import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LandingPagesService } from '../services/landing-pages.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { LandingPageProfile } from '@/customers/customers/domain/landing-page-profile';
import { UpdateLandingPageProfileDto } from '@/customers/customers/dto/update-landing-page-profile.dto';
import { Public } from '@/auth/auth.service';
import { first } from 'lodash';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';
import { CreateCustomUrlDto } from '../dto/create-custom-url.dto';
import { IsAdminGuard } from '@/internal/common/guards/is-admin.guard';

@Controller({ path: 'landing-pages', version: '1' })
export class LandingPagesController {
  constructor(private readonly service: LandingPagesService) {}

  @Get('profile')
  public getLandingPageProfile(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ): LandingPageProfile {
    return customer.landingPageProfile;
  }

  @Post('profile')
  async saveLandingPageProfile(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Body(ValidationPipe) dto: UpdateLandingPageProfileDto,
  ): Promise<LandingPageProfile> {
    const result = await this.service.saveProfile(customer.id, dto);
    return result.landingPageProfile;
  }

  @Get('profile/:email')
  @Public()
  async getLandingPageDetailsByEmail(
    @Param('email') email: string,
  ): Promise<LandingPageProfile> {
    const landingPageDetails = await this.service.getLandingPageDetailsByEmail(
      email,
    );
    const { landingPageProfile } = first(landingPageDetails);
    return landingPageProfile;
  }

  @UseGuards(IsAdminGuard)
  @Get('custom-url/:email')
  async getCustomLandingPageByEmail(
    @Param('email')
    email: string,
  ) {
    return this.service.findDetailsByEmail(email);
  }

  @UseGuards(IsAdminGuard)
  @Post('custom-url')
  async createCustomLandingPage(@Body(ValidationPipe) dto: CreateCustomUrlDto) {
    return this.service.createCustomLandingPage(dto);
  }

  @UseGuards(IsAdminGuard)
  @Patch('custom-url/:id')
  async updateCustomLandingPageUrl(
    @Param('id') id: string,
    @Body(ValidationPipe) body: Partial<CreateCustomUrlDto>,
  ) {
    return this.service.updateCustomLandingPage(id, body);
  }

  @UseGuards(IsAdminGuard)
  @Delete('custom-url/:id')
  async deleteCustomlandingPageUrl(@Param('id') id: string) {
    return this.service.deleteCustomLandingPage(id);
  }
}
