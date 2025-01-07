import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class BookStoreResponseDto {
  @Expose()
  id: number;

  @Expose()
  qty: number;
}
