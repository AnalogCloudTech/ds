import { Query } from '@nestjs/common';
import { FilterableService } from './filterable.service';

export abstract class FilterableController<T> {
  protected abstract getFilterableService(): FilterableService<T>;

  filter(@Query('$filter') filter?: string) {
    return this.getFilterableService().search(filter);
  }
}
