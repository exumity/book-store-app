import { Exclude, Expose, Type } from 'class-transformer';
import { MetaResponseDto } from '../../common/dto/meta.response.dto';
import { BookResponseDto } from './book.response.dto';

@Exclude()
export class BooksResponseDto extends MetaResponseDto {
  @Type(() => BookResponseDto)
  @Expose()
  books: BookResponseDto[];
}
