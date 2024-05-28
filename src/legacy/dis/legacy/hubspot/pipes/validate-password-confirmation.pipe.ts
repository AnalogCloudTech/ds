import { BadRequestException, PipeTransform } from '@nestjs/common';
import { UpdateAfyPasswordDto } from '@/legacy/dis/legacy/hubspot/dto/contact.dto';

export class ValidatePasswordConfirmationPipe implements PipeTransform {
  transform(dto: UpdateAfyPasswordDto): UpdateAfyPasswordDto {
    if (dto.password !== dto.passwordConfirmation) {
      throw new BadRequestException([
        'Password and confirmation must have same value',
      ]);
    }

    return dto;
  }
}
