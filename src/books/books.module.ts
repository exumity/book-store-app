import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { BookStoreModule } from '../book_store/book_store.module';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), BookStoreModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
