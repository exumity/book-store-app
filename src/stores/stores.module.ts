import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { BookStoreModule } from '../book_store/book_store.module';

@Module({
  imports: [TypeOrmModule.forFeature([Store]), BookStoreModule],
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule {}
