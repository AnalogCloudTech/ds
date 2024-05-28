import { PipeTransform } from '@nestjs/common';
import { UpdateAfyPasswordDto } from '@/legacy/dis/legacy/hubspot/dto/contact.dto';
import { hash } from 'bcryptjs';

export class TransformPasswordEncryptedPipe implements PipeTransform {
  async transform(dto: UpdateAfyPasswordDto): Promise<UpdateAfyPasswordDto> {
    const encryptedPassword = await hash(dto.password, 10);
    return <UpdateAfyPasswordDto>{
      ...dto,
      encryptedPassword,
    };
  }
}
