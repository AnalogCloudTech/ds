import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions, Types } from 'mongoose';
import { CreateBookDto } from '../dto/create-book.dto';
import { Book, BookDocument } from '../schemas/book.schema';

export type CreateBookDtoWithCustomer = CreateBookDto & {
  customer: Types.ObjectId;
};

@Injectable()
export class BooksRepository {
  constructor(
    @InjectModel(Book.name)
    private readonly model: Model<BookDocument>,
  ) {}

  create(dto: CreateBookDtoWithCustomer): Promise<BookDocument> {
    return new this.model(dto).save();
  }

  find(
    filter: FilterQuery<Book>,
    options = <QueryOptions>{ skip: 0, limit: 15, lean: true },
  ): Promise<BookDocument[]> {
    return this.model.find(filter, {}, options).exec();
  }

  findOne(
    filter: FilterQuery<Book>,
    options = <QueryOptions>{ lean: true },
  ): Promise<BookDocument> {
    return this.model.findOne(filter, {}, options).exec();
  }

  async delete(filter: FilterQuery<Book>): Promise<BookDocument> {
    const book = await this.model.findOneAndDelete(filter).exec();

    if (!book) {
      throw new HttpException(
        { message: 'book not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return book;
  }

  async update(
    filter: FilterQuery<Book>,
    update: Partial<Book>,
    options = <QueryOptions>{ lean: true, new: true },
  ): Promise<BookDocument> {
    const book = await this.model
      .findOneAndUpdate(filter, update, options)
      .exec();

    if (!book) {
      throw new HttpException(
        { message: 'book not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return book;
  }
}
