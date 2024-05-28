import { BooksRepository } from '../repositories/books.repository';
import { CreateBookDto } from '../dto/create-book.dto';
import { Injectable } from '@nestjs/common';
import { Book } from '../schemas/book.schema';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { FilterQuery, QueryOptions } from 'mongoose';

@Injectable()
export class BooksService {
  constructor(private readonly booksRepository: BooksRepository) {}

  create(dto: CreateBookDto, customer: CustomerDocument) {
    return this.booksRepository.create({ ...dto, customer: customer._id });
  }

  find(
    filter: FilterQuery<Book>,
    options?: QueryOptions,
    customer?: CustomerDocument,
  ) {
    if (customer) {
      filter['customerId'] = customer._id;
    }

    return this.booksRepository.find(filter, options);
  }

  findOne(filter: FilterQuery<Book>, customer?: CustomerDocument) {
    if (customer) {
      filter['customerId'] = customer._id;
    }

    return this.booksRepository.findOne(filter);
  }

  delete(filter: FilterQuery<Book>, customer?: CustomerDocument) {
    if (customer) {
      filter['customerId'] = customer._id;
    }

    return this.booksRepository.delete(filter);
  }

  update(
    filter: FilterQuery<Book>,
    dto: Partial<Book>,
    customer?: CustomerDocument,
  ) {
    if (customer) {
      filter['customerId'] = customer._id;
    }

    return this.booksRepository.update(filter, dto);
  }
}
