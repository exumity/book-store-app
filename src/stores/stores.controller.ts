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
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../common/enums/user-type.enum';
import { PaginationDto } from '../common/dto/pagination.dto';
import { IncDecBookQtyDto } from './dto/inc-dec-book-qty.dto';
import { BookStoreResponseDto } from './dto/book-store.response.dto';
import { plainToInstance } from 'class-transformer';
import { StoresResponseDto } from './dto/stores.response.dto';
import { AvailableBooksResponseDto } from './dto/available-books.response.dto';
import { StoreResponseDto } from './dto/store.response.dto';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @Roles(UserType.ADMIN)
  async create(
    @Body() createStoreDto: CreateStoreDto,
  ): Promise<StoreResponseDto> {
    return plainToInstance(
      StoreResponseDto,
      await this.storesService.create(createStoreDto),
    );
  }

  @Get()
  @Roles(UserType.ADMIN, UserType.STORE_MANAGER, UserType.USER)
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<StoresResponseDto> {
    const [stores, total] = await this.storesService.findAll(
      paginationDto.take,
      paginationDto.skip,
    );

    return plainToInstance(StoresResponseDto, {
      stores,
      meta: {
        total,
      },
    });
  }

  @Get(':id/books')
  @Roles(UserType.ADMIN, UserType.STORE_MANAGER, UserType.USER)
  async listAvailableBooks(
    @Param('id') id: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<AvailableBooksResponseDto> {
    const [bookStores, total] =
      await this.storesService.listAvailableRelatedBooks(+id, paginationDto);
    return plainToInstance(AvailableBooksResponseDto, {
      books: bookStores,
      meta: {
        total,
      },
    });
  }

  @Get(':id')
  @Roles(UserType.ADMIN, UserType.STORE_MANAGER, UserType.USER)
  async findOne(@Param('id') id: string): Promise<StoreResponseDto> {
    return plainToInstance(
      StoreResponseDto,
      await this.storesService.findOne(+id),
    );
  }

  @Post('/:id/increase-quantity')
  @Roles(UserType.ADMIN, UserType.STORE_MANAGER)
  @HttpCode(HttpStatus.OK)
  async increaseBookQuantity(
    @Param('id') id: string,
    @Body() incDecBookQtyDto: IncDecBookQtyDto,
  ): Promise<BookStoreResponseDto> {
    const result = this.storesService.increaseBookQuantity(
      +id,
      incDecBookQtyDto.bookId,
      incDecBookQtyDto.qty,
    );
    return plainToInstance(BookStoreResponseDto, result);
  }

  @Post('/:id/decrease-quantity')
  @Roles(UserType.ADMIN, UserType.STORE_MANAGER)
  @HttpCode(HttpStatus.OK)
  async decreaseBookQuantity(
    @Param('id') id: string,
    @Body() incDecBookQtyDto: IncDecBookQtyDto,
  ): Promise<BookStoreResponseDto> {
    const result = await this.storesService.decreaseBookQuantity(
      +id,
      incDecBookQtyDto.bookId,
      incDecBookQtyDto.qty,
    );
    return plainToInstance(BookStoreResponseDto, result);
  }

  @Patch(':id')
  @Roles(UserType.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ): Promise<StoreResponseDto> {
    const result = await this.storesService.update(+id, updateStoreDto);
    if (!result.affected || result.affected === 0) {
      throw new BadRequestException('Book could not be updated');
    }
    return plainToInstance(StoreResponseDto, result.raw);
  }

  @Roles(UserType.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.storesService.remove(+id);
  }
}
