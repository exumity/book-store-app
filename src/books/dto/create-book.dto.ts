import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({
    type: 'string',
  })
  @MaxLength(256)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: 'string',
  })
  @MaxLength(64)
  @IsString()
  @IsNotEmpty()
  publisher: string;

  @ApiProperty({
    type: 'string',
  })
  @IsInt()
  @IsNotEmpty()
  isbn: string;
}
