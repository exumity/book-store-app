import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { BookStoreService } from '../book_store/book_store.service';
import { BookStore } from '../book_store/entities/book_store.entity';
import { DataSource } from 'typeorm';

describe('BooksController', () => {
  let controller: BooksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        BooksService,
        BookStoreService,
        {
          provide: getRepositoryToken(Book),
          useFactory: () => ({}),
        },
        {
          provide: getRepositoryToken(BookStore),
          useFactory: () => ({}),
        },
        {
          provide: DataSource,
          useFactory: () => ({}),
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
