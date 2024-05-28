import { Inject, Injectable, PipeTransform, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';

@Injectable({ scope: Scope.REQUEST })
export class IsAdmin implements PipeTransform {
  constructor(
    @Inject(REQUEST) private readonly request,
    private readonly hubspotService: HubspotService,
  ) {}

  async transform(): Promise<boolean> {
    const { email } = this.request.user;

    const isAdmin: boolean = await this.hubspotService.isAdminByEmail(email);

    return isAdmin;
  }
}
