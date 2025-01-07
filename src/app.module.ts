import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresModule } from './stores/stores.module';
import configuration, { Configuration } from './common/config/configuration';
import { BookStoreModule } from './book_store/book_store.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { Store } from './stores/entities/store.entity';
import { Book } from './books/entities/book.entity';
import { BookStore } from './book_store/entities/book_store.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.development.env',
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Configuration>) => ({
        type: 'postgres',
        host: configService.getOrThrow('postgreHost'),
        port: 5432,
        password: configService.getOrThrow('postgrePass'),
        username: configService.getOrThrow('postgreUser'),
        database: configService.getOrThrow('postgreDB'),
        entities: [User, Book, Store, BookStore],
        synchronize: true,
        logging: false,
      }),
    }),
    AuthModule,
    StoresModule,
    BookStoreModule,
    UsersModule,
    BooksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
