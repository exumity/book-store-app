import { StoreResponseDto } from '../../stores/dto/store.response.dto';
import { Exclude, Expose, Type } from 'class-transformer';
import { MetaResponseDto } from '../../common/dto/meta.response.dto';

@Exclude()
export class AvailableStoresResponseDto extends MetaResponseDto {
  @Expose()
  @Type(() => Array<StoreResponseDto>)
  stores: StoreResponseDto[];
}
