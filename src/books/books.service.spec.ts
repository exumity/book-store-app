import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { BookStoreService } from '../book_store/book_store.service';
import { BookStore } from '../book_store/entities/book_store.entity';
import { DataSource } from 'typeorm';

describe('BooksService', () => {
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
