import { ForbiddenException, Injectable, PipeTransform } from '@nestjs/common';
import { OnboardMetricsDto } from '@/onboard/dto/onboard-metrics.dto';

@Injectable()
export class OnboardFilterPipe implements PipeTransform {
  transform({ filter }: { filter: string }): OnboardMetricsDto {
    const obj = <OnboardMetricsDto>JSON.parse(filter);
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (!Array.isArray(obj[key])) {
          throw new ForbiddenException('Filter object value must be Array');
        }
      }
    }
    return obj;
  }
}
