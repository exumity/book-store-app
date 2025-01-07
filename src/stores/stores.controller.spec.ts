import { Test, TestingModule } from '@nestjs/testing';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { BookStoreService } from '../book_store/book_store.service';
import { BookStore } from '../book_store/entities/book_store.entity';
import { DataSource } from 'typeorm';

describe('StoresController', () => {
  let controller: StoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoresController],
      providers: [
        StoresService,
        BookStoreService,
        {
          provide: getRepositoryToken(Store),
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

    controller = module.get<StoresController>(StoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
