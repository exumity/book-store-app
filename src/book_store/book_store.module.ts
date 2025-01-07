import { Module } from '@nestjs/common';
import { BookStoreService } from './book_store.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookStore } from './entities/book_store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookStore])],
  providers: [BookStoreService],
  exports: [BookStoreService],
})
export class BookStoreModule {}
