import { IsInt, IsNotEmpty, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IncDecBookQtyDto {
  @ApiProperty({
    type: 'string',
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  bookId: number;

  @ApiProperty({
    type: 'string',
  })
  @Min(1)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  qty: number;
}
