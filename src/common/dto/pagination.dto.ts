import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @Max(100)
  @Min(1)
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  take: number = 50;

  @Min(0)
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  skip: number = 0;
}
