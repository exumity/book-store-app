import { IsInt, IsNotEmpty, IsPositive, Min } from 'class-validator';

export class IncDecBookQtyDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  bookId: number;

  @Min(1)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  qty: number;
}
