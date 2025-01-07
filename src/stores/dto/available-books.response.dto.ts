import { MetaResponseDto } from '../../common/dto/meta.response.dto';
import { Exclude, Expose, Type } from 'class-transformer';
import { AvailableBookResponseDto } from './available-book.response.dto';

@Exclude()
export class AvailableBooksResponseDto extends MetaResponseDto {
  @Expose()
  @Type(() => AvailableBookResponseDto)
  books: AvailableBookResponseDto[];
}
