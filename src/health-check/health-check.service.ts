import { Injectable } from '@nestjs/common';
import {
  HealthItem,
  HealthStatus,
  SystemHealth,
} from '@/health-check/domain/types';
import { CmsService } from '@/cms/cms/cms.service';
import { DateTime } from 'luxon';
import * as redis from '@redis/client';
import { ConfigService } from '@nestjs/config';
import { GenerateBookService } from '@/onboard/generate-book/generate-book.service';
import { AnalyticsService } from '@/legacy/dis/legacy/analytics/analytics.service';

export type Methods =
  | 'checkStrapi'
  | 'checkRedis'
  | 'checkBba'
  | 'checkElasticsearch';

@Injectable()
export class HealthCheckService {
  constructor(
    private readonly configService: ConfigService,
    private readonly cmsService: CmsService,
    private readonly generateBookService: GenerateBookService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  public selectService(service: Methods): Promise<HealthItem> {
    return this[service]();
  }

  async systemHealth(): Promise<SystemHealth> {
    const services: Array<HealthItem> = await Promise.all([
      this.checkStrapi(),
      // this.checkRedis(),
      this.checkBba(),
      this.checkElasticsearch(),
    ]);

    return <SystemHealth>{
      name: 'Digital Services',
      services,
      status: services.find((item) => item.status === HealthStatus.HEALTH_DEAD)
        ? HealthStatus.HEALTH_DEAD
        : HealthStatus.HEALTH_ALIVE,
      responseTime: services.reduce((acc, next) => acc + next.responseTime, 0),
    };
  }

  async checkStrapi(): Promise<HealthItem> {
    const startTime = DateTime.now();
    let status = HealthStatus.HEALTH_ALIVE;
    try {
      await this.cmsService.healthCheck();
    } catch (e) {
      status = HealthStatus.HEALTH_DEAD;
    }
    const endTime = DateTime.now();
    const responseTime = endTime.diff(startTime).toMillis();

    return <HealthItem>{
      name: 'Strapi',
      key: 'strapi',
      status,
      responseTime,
    };
  }

  // async checkRedis(): Promise<HealthItem> {
  //   const startTime = DateTime.now();
  //   let status = HealthStatus.HEALTH_ALIVE;
  //
  //   try {
  //     const username = this.configService.get<string>('redis.username');
  //     const password = this.configService.get<string>('redis.password');
  //     const host = this.configService.get<string>('redis.host');
  //
  //     const conf = {
  //       url: `redis://${host}:6379`,
  //     };
  //
  //     if (username) {
  //       conf['username'] = username;
  //     }
  //
  //     if (password) {
  //       conf['password'] = password;
  //     }
  //
  //     const client = redis.createClient(conf);
  //
  //     client.on('error', function (error) {
  //       // TODO: remove console.log
  //       console.log(`Error in redis: ${error}`);
  //     });
  //
  //     await client.connect();
  //     await client.ping();
  //     await client.disconnect();
  //   } catch (e) {
  //     status = HealthStatus.HEALTH_DEAD;
  //   }
  //
  //   const endTime = DateTime.now();
  //   const responseTime = endTime.diff(startTime).toMillis();
  //
  //   return <HealthItem>{
  //     name: 'Redis',
  //     key: 'redis',
  //     status,
  //     responseTime,
  //   };
  // }

  async checkBba(): Promise<HealthItem> {
    const startTime = DateTime.now();
    let status = HealthStatus.HEALTH_ALIVE;
    try {
      await this.generateBookService.healthCheck();
    } catch (e) {
      status = HealthStatus.HEALTH_DEAD;
    }
    const endTime = DateTime.now();
    const responseTime = endTime.diff(startTime).toMillis();

    return <HealthItem>{
      name: 'Book Builder Application',
      key: 'bba',
      status: status,
      responseTime,
    };
  }

  async checkElasticsearch(): Promise<HealthItem> {
    const startTime = DateTime.now();
    let status = HealthStatus.HEALTH_ALIVE;

    try {
      await this.analyticsService.clusterHealth();
    } catch (exception) {
      status = HealthStatus.HEALTH_DEAD;
    }
    const endTime = DateTime.now();
    const responseTime = endTime.diff(startTime).toMillis();

    return <HealthItem>{
      name: 'ElasticSearch',
      key: 'es',
      status: status,
      responseTime,
    };
  }
}
