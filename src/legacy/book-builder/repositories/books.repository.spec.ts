import { HttpException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  getError,
  NoErrorThrownError,
} from '../../../../test/utils/error.handler';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../../test/utils/db.handler';
import { BooksBuilderModule } from '../books-builder.module';
import { BooksRepository, CreateBookDtoWithCustomer } from './books.repository';
import { Types } from 'mongoose';
import { CustomersModule } from '@/customers/customers/customers.module';
import { ConfigModule } from '@nestjs/config';

function mockCreateBookDto(): CreateBookDtoWithCustomer {
  return {
    bookId: new Types.ObjectId('5f9f1c1c1c1c1c1c1c1c1c1c'),
    customer: new Types.ObjectId('5f9f1c1c1c1c1c1c1c1c1c1c'),
    title: 'Test Book',
    customLandingPageUrl: 'https://www.google.com',
    digitalBookUrl: 'https://www.google.com',
    landingPageUrl: 'https://www.google.com',
  };
}

describe('Books Repository', () => {
  let booksRepository: BooksRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        BooksBuilderModule,
        CustomersModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => {
              return {};
            },
          ],
        }),
      ],
    }).compile();

    booksRepository = module.get<BooksRepository>(BooksRepository);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should define module', () => {
    expect(booksRepository).toBeDefined();
  });

  it('should create a book', async () => {
    const dto: CreateBookDtoWithCustomer = mockCreateBookDto();

    const book = await booksRepository.create(dto);
    const searchBook = await booksRepository.findOne({ _id: book._id });

    expect(book).toBeDefined();
    expect(searchBook).toBeDefined();
    expect(searchBook._id).toEqual(book._id);
    expect(searchBook.customer).toEqual(book.customer);
    expect(searchBook.title).toEqual(book.title);
    expect(searchBook.customLandingPageUrl).toEqual(book.customLandingPageUrl);
    expect(searchBook.digitalBookUrl).toEqual(book.digitalBookUrl);
    expect(searchBook.landingPageUrl).toEqual(book.landingPageUrl);
  });

  it('should find a one book', async () => {
    const dto: CreateBookDtoWithCustomer = mockCreateBookDto();

    const book = await booksRepository.create(dto);
    const searchBook = await booksRepository.findOne({ _id: book._id });

    expect(book).toBeDefined();
    expect(searchBook).toBeDefined();
    expect(searchBook._id).toEqual(book._id);
  });

  it('should find a list of books', async () => {
    const dto: CreateBookDtoWithCustomer = mockCreateBookDto();

    await booksRepository.create(dto);
    const books = await booksRepository.find({});

    expect(books).toBeDefined();
    expect(books.length).toBeGreaterThan(0);
  });

  it('should delete a book', async () => {
    const dto: CreateBookDtoWithCustomer = mockCreateBookDto();
    const book = await booksRepository.create(dto);

    expect(book).toBeDefined();
    await booksRepository.delete({ _id: book._id });
    const searchBook = await booksRepository.findOne({ _id: book._id });
    expect(searchBook).toBeNull();
  });

  it('should throw error when trying to delete a book not found', async () => {
    const error = await getError(async () => {
      return booksRepository.delete({
        _id: '5f9f1c1c1c1c1c1c1c1c1c1c',
      });
    });
    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toBeInstanceOf(HttpException);
  });

  it('should update a book', async () => {
    const dto: CreateBookDtoWithCustomer = mockCreateBookDto();

    const book = await booksRepository.create(dto);
    await booksRepository.update({ _id: book._id }, { title: 'New Title' });

    const searchBook = await booksRepository.findOne({ _id: book._id });

    expect(book).toBeDefined();
    expect(searchBook).toBeDefined();
    expect(searchBook._id).toEqual(book._id);
    expect(searchBook.title).toEqual('New Title');
  });

  it('should throw error when trying to update a book not found', async () => {
    const error = await getError(async () => {
      return booksRepository.update(
        {
          _id: '5f9f1c1c1c1c1c1c1c1c1c1c',
        },
        { title: 'fail' },
      );
    });
    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toBeInstanceOf(HttpException);
  });
});
