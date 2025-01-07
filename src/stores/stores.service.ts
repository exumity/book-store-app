import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';
import { BookStoreService } from '../book_store/book_store.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store) private storeRepository: Repository<Store>,
    private readonly bookStoreService: BookStoreService,
  ) {}
  async create(createStoreDto: CreateStoreDto) {
    return this.storeRepository.save(createStoreDto);
  }

  async findAll(take: number, skip: number) {
    return this.storeRepository.findAndCount({ take, skip });
  }

  async findOne(id: number) {
    return this.storeRepository.findOneBy({ id });
  }

  async update(id: number, updateStoreDto: UpdateStoreDto) {
    return this.storeRepository.update(id, updateStoreDto);
  }

  async remove(id: number) {
    return this.storeRepository.delete(id);
  }

  async listAvailableRelatedBooks(id: number, paginationDto: PaginationDto) {
    return this.bookStoreService.listAvailableBooksByStoreId(
      id,
      paginationDto.take,
      paginationDto.skip,
    );
  }

  async increaseBookQuantity(id: number, bookId: number, qty: number) {
    return await this.bookStoreService.updateQty(
      {
        bookId,
        qty,
        storeId: id,
      },
      'inc',
    );
  }

  async decreaseBookQuantity(id: number, bookId: number, qty: number) {
    return await this.bookStoreService.updateQty(
      {
        bookId,
        qty,
        storeId: id,
      },
      'dec',
    );
  }
}
