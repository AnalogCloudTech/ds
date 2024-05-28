import { GenerateBookDto } from './dto/generate-book.dto';
import { GenerateBookStatus } from './domain/generate-book-status';
import { Axios } from 'axios';
import { HealthItem } from '@/health-check/domain/types';
export declare class GenerateBookService {
    private readonly http;
    constructor(http: Axios);
    generateBook(generateBookDto: GenerateBookDto): Promise<string>;
    getStatus(draftId: string): Promise<GenerateBookStatus>;
    healthCheck(): Promise<HealthItem>;
}
