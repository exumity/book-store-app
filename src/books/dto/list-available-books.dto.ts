import { PaginationDto } from '../../common/dto/pagination.dto';
import { IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ListAvailableBooksDto extends PaginationDto {
  @ApiProperty({
    type: 'boolean',
  })
  @IsBoolean()
  @Type(() => Boolean)
  available: boolean = true;
}
