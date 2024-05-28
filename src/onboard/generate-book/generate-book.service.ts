import { Inject, Injectable } from '@nestjs/common';
import { GenerateBookDto } from './dto/generate-book.dto';
import { GenerateBookStatus } from './domain/generate-book-status';
import { Axios } from 'axios';
import { HealthItem } from '@/health-check/domain/types';

@Injectable()
export class GenerateBookService {
  constructor(@Inject('HTTP_GENERATE_BOOK') private readonly http: Axios) {}

  async generateBook(generateBookDto: GenerateBookDto): Promise<string> {
    const response = await this.http.post(
      '/onboarding/generate-book',
      generateBookDto,
    );
    const { data } = response;
    return data;
  }

  async getStatus(draftId: string): Promise<GenerateBookStatus> {
    const response = await this.http.get(`/onboarding/${draftId}/status`);
    const { data } = response;
    return data;
  }

  /**
   * @throws Exception
   */
  async healthCheck(): Promise<HealthItem> {
    const response = await this.http.get('/health');
    return <HealthItem>response.data;
  }
}
