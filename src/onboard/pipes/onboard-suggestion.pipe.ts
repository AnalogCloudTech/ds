import { Injectable, PipeTransform } from '@nestjs/common';
import { SearchSuggestionsDto } from '@/onboard/dto/onboard-metrics.dto';

@Injectable()
export class OnboardSuggestionPipe implements PipeTransform {
  transform({ filter }: { filter: string }): SearchSuggestionsDto {
    const obj = <SearchSuggestionsDto>JSON.parse(filter);
    return obj;
  }
}
