import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { HealthCheckService, Methods } from './health-check.service';
import { SystemHealth } from '@/health-check/domain/types';
import { capitalizeFirstLetter } from '@/internal/utils/string';
import { Public } from '@/auth/auth.service';

@Controller({ path: 'health', version: '1' })
export class HealthCheckController {
  constructor(private readonly heathCheckService: HealthCheckService) {}

  @Get()
  @Public()
  heath(): Promise<SystemHealth> {
    return this.heathCheckService.systemHealth();
  }

  @Get(':service')
  service(@Param('service') service: string) {
    try {
      const method = `check${capitalizeFirstLetter(service)}`;
      return this.heathCheckService.selectService(method as Methods);
    } catch (e) {
      if (e instanceof Error) {
        throw new NotFoundException(
          'Service not found => Available services [redis, strapi, bba, elasticsearch]',
        );
      }
    }
  }
}
