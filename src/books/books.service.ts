import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { BookStoreService } from '../book_store/book_store.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly booksRepository: Repository<Book>,
    private readonly bookStoreService: BookStoreService,
  ) {}

  async create(createBookDto: CreateBookDto) {
    return this.booksRepository.save(createBookDto);
  }

  async findAll(paginationDto: PaginationDto) {
    return this.booksRepository.findAndCount(paginationDto);
  }

  async findOne(id: number) {
    return this.booksRepository.findOneBy({ id });
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    return this.booksRepository.update(id, updateBookDto);
  }

  async remove(id: number) {
    const bookStore = await this.bookStoreService.findOneStoreByBookId(id);
    if (bookStore) {
      throw new BadRequestException(
        'You can not remove the book. Because book has store stock!',
      );
    }
    return this.booksRepository.delete(id);
  }

  async listAvailableRelatedStores(id: number, paginationDto: PaginationDto) {
    return await this.bookStoreService.listAvailableStoresByBookId(
      id,
      paginationDto.take,
      paginationDto.skip,
    );
  }

  async listAvailableBooks(paginationDto: PaginationDto) {
    return await this.bookStoreService.listAvailableBooks(
      paginationDto.take,
      paginationDto.skip,
    );
  }
}
