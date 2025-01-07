import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookStoreDto } from './dto/create-book_store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BookStore } from './entities/book_store.entity';
import { DataSource, MoreThan, Repository } from 'typeorm';

@Injectable()
export class BookStoreService {
  constructor(
    @InjectRepository(BookStore)
    private readonly bookStoreRepository: Repository<BookStore>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createBookStoreDto: CreateBookStoreDto) {
    return this.bookStoreRepository.save(createBookStoreDto);
  }

  async findAll(take: number, skip: number) {
    return await this.bookStoreRepository.findAndCount({
      relations: ['book', 'store'],
      skip,
      take,
    });
  }

  async findOneStoreByBookId(bookId: number) {
    return await this.bookStoreRepository.findOneBy({ book: bookId });
  }

  async listAvailableBooks(skip: number, take: number) {
    const builder = this.bookStoreRepository
      .createQueryBuilder('bookStore')
      .innerJoinAndSelect('bookStore.book', 'book')
      .select([
        'book.id AS "id"',
        'book.name AS name',
        'book.isbn AS isbn',
        'book.publisher AS publisher',
      ])
      .addSelect('SUM(bookStore.qty)', 'totalQty')
      .where('bookStore.qty >= 0')
      .groupBy('book.id')
      .skip(skip)
      .take(take);
    const results = await Promise.all([
      builder.getRawMany(),
      builder.getCount(),
    ]);
    return {
      books: results[0],
      total: results[1],
    };
  }

  async listAvailableBooksByStoreId(
    storeId: number,
    take: number,
    skip: number,
  ) {
    return await this.bookStoreRepository.findAndCount({
      where: { qty: MoreThan(0), store: storeId },
      skip,
      take,
      relations: ['book', 'store'],
    });
  }

  async listAvailableStoresByBookId(
    bookId: number,
    take: number,
    skip: number,
  ) {
    return await this.bookStoreRepository.findAndCount({
      where: { qty: MoreThan(0), book: bookId },
      skip,
      take,
      relations: ['store'],
    });
  }

  async findOneById(id: number, withRelations = false) {
    return this.bookStoreRepository.findOne({
      where: { id },
      relations: withRelations ? ['book', 'store'] : [],
    });
  }

  async findOneByStoreIdAndBookId(
    storeId: number,
    bookId: number,
    withRelations = false,
  ) {
    return this.bookStoreRepository.findOne({
      where: { store: storeId, book: bookId },
      relations: withRelations ? ['book', 'store'] : [],
    });
  }

  async updateQty(createBookStoreDto: CreateBookStoreDto, type: 'inc' | 'dec') {
    return this.dataSource.transaction(async (manager) => {
      let bookStore = await manager
        .createQueryBuilder(BookStore, 'bookStore')
        .where({
          book: createBookStoreDto.bookId,
          store: createBookStoreDto.storeId,
        })
        .setLock('pessimistic_write')
        .getOne();

      if (!bookStore) {
        bookStore = manager.create(BookStore, {
          store: createBookStoreDto.storeId,
          book: createBookStoreDto.bookId,
          qty: createBookStoreDto.qty,
        });
      } else {
        if (type === 'dec') {
          const newQuantity = bookStore.qty - createBookStoreDto.qty;
          if (newQuantity < 0) {
            throw new BadRequestException('Quantity must be greater than 0');
          }
          bookStore.qty = bookStore.qty - createBookStoreDto.qty;
        } else if (type === 'inc') {
          bookStore.qty = bookStore.qty + createBookStoreDto.qty;
        } else {
          throw new BadRequestException('Invalid operation type!');
        }
      }

      await manager.save(bookStore);
      return {
        id: bookStore.id,
        qty: bookStore.qty,
      };
    });
  }
}
