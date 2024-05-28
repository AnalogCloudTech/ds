import { CustomersService } from '@/customers/customers/customers.service';
import { CustomerId } from '@/customers/customers/domain/types';
import { UpdateLandingPageProfileDto } from '@/customers/customers/dto/update-landing-page-profile.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { map } from 'lodash';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import { LandingPagesRepository } from '../repositories/landing-pages.repository';
import { CreateCustomUrlDto } from '../dto/create-custom-url.dto';

@Injectable()
export class LandingPagesService {
  constructor(
    private readonly landingPagesRepository: LandingPagesRepository,
    private readonly service: CustomersService,
    private readonly hubspotService: HubspotService,
  ) {}

  async saveProfile(id: CustomerId, dto: UpdateLandingPageProfileDto) {
    return this.service.saveLandingPageProfile(id, dto);
  }

  async getLandingPageDetailsByEmail(email: string) {
    const hubSpotDetails: any = await this.hubspotService.getContactEmailIds(
      email,
    );
    const emailVersions = hubSpotDetails.versions;
    let filteredHubSpotDetails = await map(
      emailVersions,
      (result) => result.value,
    );
    filteredHubSpotDetails = await this.service.landingPageDetailsByEmail(
      filteredHubSpotDetails,
    );
    return filteredHubSpotDetails;
  }

  async findDetailsByEmail(email: string) {
    const details = await this.landingPagesRepository.findByEmail(email);

    if (!details) {
      throw new HttpException(
        {
          message: 'Customer landing page details not found',
          method: 'patch',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return details;
  }

  async createCustomLandingPage(dto: CreateCustomUrlDto) {
    return this.landingPagesRepository.create(dto);
  }

  async updateCustomLandingPage(id: string, dto: Partial<CreateCustomUrlDto>) {
    return this.landingPagesRepository.update(id, dto);
  }

  async deleteCustomLandingPage(id: string) {
    return this.landingPagesRepository.delete(id);
  }
}
