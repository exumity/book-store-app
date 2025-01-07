import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class BookResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  publisher: string;

  @Expose()
  isbn: string;
}
