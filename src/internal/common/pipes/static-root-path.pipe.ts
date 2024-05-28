import { Injectable, PipeTransform } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class StaticRootPathPipe implements PipeTransform {
  transform(): string {
    return join(__dirname, '..', '..', '..', '..', 'static');
  }
}
