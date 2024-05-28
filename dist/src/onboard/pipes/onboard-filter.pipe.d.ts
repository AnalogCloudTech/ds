import { PipeTransform } from '@nestjs/common';
import { OnboardMetricsDto } from '@/onboard/dto/onboard-metrics.dto';
export declare class OnboardFilterPipe implements PipeTransform {
    transform({ filter }: {
        filter: string;
    }): OnboardMetricsDto;
}
