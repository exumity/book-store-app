import { PaginationDto } from '../../common/dto/pagination.dto';
import { IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class ListAvailableBooksDto extends PaginationDto {
  @IsBoolean()
  @Type(() => Boolean)
  available: boolean = true;
}
