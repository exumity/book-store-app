import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../common/enums/user-type.enum';
import { PaginationDto } from '../common/dto/pagination.dto';
import { plainToInstance } from 'class-transformer';
import { BookResponseDto } from './dto/book.response.dto';
import { AvailableBooksResponseDto } from '../stores/dto/available-books.response.dto';
import { AvailableStoresResponseDto } from './dto/available-stores.response.dto';
import { BooksResponseDto } from './dto/books.response.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @Roles(UserType.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBookDto: CreateBookDto): Promise<BookResponseDto> {
    return plainToInstance(
      BookResponseDto,
      await this.booksService.create(createBookDto),
    );
  }

  @Get()
  @Roles(UserType.ADMIN, UserType.STORE_MANAGER, UserType.STORE_MANAGER)
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<BooksResponseDto> {
    const [books, total] = await this.booksService.findAll(paginationDto);
    return plainToInstance(BooksResponseDto, {
      books,
      meta: {
        total,
      },
    });
  }

  @Get('available')
  @Roles(UserType.ADMIN, UserType.STORE_MANAGER, UserType.STORE_MANAGER)
  async listAvailableBooks(
    @Query() paginationDto: PaginationDto,
  ): Promise<AvailableBooksResponseDto> {
    const { books, total } =
      await this.booksService.listAvailableBooks(paginationDto);
    return plainToInstance(AvailableBooksResponseDto, {
      books,
      meta: {
        total,
      },
    });
  }

  @Get(':id')
  @Roles(UserType.ADMIN, UserType.STORE_MANAGER, UserType.STORE_MANAGER)
  async findOne(@Param('id') id: string) {
    return plainToInstance(
      BookResponseDto,
      await this.booksService.findOne(+id),
    );
  }

  @Patch(':id')
  @Roles(UserType.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<BookResponseDto> {
    const result = await this.booksService.update(+id, updateBookDto);
    if (!result.affected || result.affected === 0) {
      throw new BadRequestException('Book could not updated');
    }
    return plainToInstance(BookResponseDto, result.raw);
  }

  @Roles(UserType.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.booksService.remove(+id);
  }

  @Get(':id')
  @Roles(UserType.ADMIN, UserType.STORE_MANAGER, UserType.STORE_MANAGER)
  async listAvailableRelatedStores(
    @Param('id') id: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<AvailableStoresResponseDto> {
    const [stores, total] = await this.booksService.listAvailableRelatedStores(
      +id,
      paginationDto,
    );
    return plainToInstance(AvailableStoresResponseDto, {
      stores,
      meta: { total },
    });
  }
}
