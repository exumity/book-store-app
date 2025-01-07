import { Exclude, Expose, Type } from 'class-transformer';
import { StoreResponseDto } from './store.response.dto';
import { MetaResponseDto } from '../../common/dto/meta.response.dto';

@Exclude()
export class StoresResponseDto extends MetaResponseDto {
  @Expose()
  @Type(() => StoreResponseDto)
  stores: StoreResponseDto[];
}
