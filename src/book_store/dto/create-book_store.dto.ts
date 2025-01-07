import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateBookStoreDto {
  @IsInt()
  @IsNotEmpty()
  storeId: number;

  @IsInt()
  @IsNotEmpty()
  bookId: number;

  @Min(0)
  @IsInt()
  qty: number;
}
