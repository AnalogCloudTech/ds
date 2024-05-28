import { Inject, Injectable, PipeTransform, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { get } from 'lodash';
import { CustomerEmailDto } from '@/internal/common/dtos/customer-email.dto';

@Injectable({ scope: Scope.REQUEST })
export class CustomerEmailTransformPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request) {}

  transform(dto: CustomerEmailDto): CustomerEmailDto {
    dto.customerEmail = get(this.request, ['user', 'email']);
    return dto;
  }
}
