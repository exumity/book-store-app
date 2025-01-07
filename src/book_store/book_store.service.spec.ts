import { Test, TestingModule } from '@nestjs/testing';
import { BookStoreService } from './book_store.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookStore } from './entities/book_store.entity';
import { DataSource } from 'typeorm';

describe('BookStoreService', () => {
  let service: BookStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookStoreService,
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

    service = module.get<BookStoreService>(BookStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
