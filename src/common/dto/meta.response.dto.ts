import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
class MetaResponseElements {
  @Expose()
  total?: number;
}

@Exclude()
export class MetaResponseDto {
  @Expose()
  @Type(() => MetaResponseElements)
  meta: MetaResponseElements;
}
