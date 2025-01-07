import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class StoreResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
