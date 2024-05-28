import { PipeTransform } from '@nestjs/common';
import { CustomerEmailDto } from '@/internal/common/dtos/customer-email.dto';
export declare class CustomerEmailTransformPipe implements PipeTransform {
    private readonly request;
    constructor(request: any);
    transform(dto: CustomerEmailDto): CustomerEmailDto;
}
