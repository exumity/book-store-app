import { Test, TestingModule } from '@nestjs/testing';
import { StoresService } from './stores.service';
import { faker } from '@faker-js/faker';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookStoreService } from '../book_store/book_store.service';

const createMockStore = (overrides?: Partial<Store>): Store => ({
  id: faker.number.int(),
  name: faker.company.name(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
});
const createMockStores = (count: number): Store[] => {
  return Array.from({ length: count }).map(() => createMockStore());
};

describe('StoresService', () => {
  let service: StoresService;
  let spyStoreRepository: Repository<Store>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoresService,
        {
          provide: BookStoreService,
          useFactory: () => ({
            create: jest.fn(),
          }),
        },
        {
          provide: getRepositoryToken(Store),
          useFactory: () => ({
            create: jest.fn((entity) => entity),
          }),
        },
      ],
    }).compile();

    service = module.get<StoresService>(StoresService);
    spyStoreRepository = module.get(getRepositoryToken(Store));
  });

  describe('create', () => {
    let store: Store;
    beforeEach(() => {
      store = createMockStore();
    });

    it('should store created', async () => {
      spyStoreRepository.save = jest.fn().mockReturnValue(store);

      const result = await service.create(store);

      expect(result).toBe(store);
      expect(spyStoreRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    let stores: Store[];
    beforeEach(() => {
      stores = createMockStores(5);
    });
    it('should return user array', async () => {
      spyStoreRepository.findAndCount = jest.fn().mockReturnValue(stores);

      const result = await service.findAll(0, 5);

      expect(result).toBe(stores);
    });
  });

  describe('findOne', () => {
    let store: Store;
    beforeEach(() => {
      store = createMockStore();
    });
    it('should return null', async () => {
      spyStoreRepository.findOneBy = jest.fn(async () => null);

      const result = await service.findOne(store.id);

      expect(result).toBe(null);
    });

    it('should return a store', async () => {
      spyStoreRepository.findOneBy = jest.fn(async () => store);

      const result = await service.findOne(store.id);

      expect(result).toBe(store);
    });
  });

  describe('update', () => {
    let store: Store;
    beforeEach(() => {
      store = createMockStore();
    });

    it('should store updated', async () => {
      spyStoreRepository.update = jest.fn();

      await service.update(store.id, {
        name: 'new_name',
      });

      expect(spyStoreRepository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    let store: Store;
    beforeEach(() => {
      store = createMockStore();
    });

    it('should store removed', async () => {
      spyStoreRepository.delete = jest.fn().mockReturnValue(store);

      const result = await service.remove(store.id);

      expect(result).toBe(store);
      expect(spyStoreRepository.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('listAvailableRelatedBooks', () => {});

  describe('increaseBookQuantity', () => {});

  describe('decreaseBookQuantity', () => {});
});
