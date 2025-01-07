import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateStoreResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
