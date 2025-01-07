import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
  @ApiProperty({
    type: 'string',
  })
  @MaxLength(128)
  @IsString()
  @IsNotEmpty()
  name: string;
}
