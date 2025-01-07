import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { BookResponseDto } from '../../books/dto/book.response.dto';

@Exclude()
export class AvailableBookResponseDto extends BookResponseDto {
  @Expose()
  @Type(() => Number)
  @Transform((val) => parseInt(val.value, 10))
  totalQty: number;
}
