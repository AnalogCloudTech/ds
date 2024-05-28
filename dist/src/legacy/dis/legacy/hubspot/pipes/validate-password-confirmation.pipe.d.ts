import { PipeTransform } from '@nestjs/common';
import { UpdateAfyPasswordDto } from '@/legacy/dis/legacy/hubspot/dto/contact.dto';
export declare class ValidatePasswordConfirmationPipe implements PipeTransform {
    transform(dto: UpdateAfyPasswordDto): UpdateAfyPasswordDto;
}
