import {
  IsAlphanumeric,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserType } from '../../common/enums/user-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsAlphanumeric()
  @MaxLength(32)
  @MinLength(1)
  @IsString()
  readonly username: string;

  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @MaxLength(32)
  @MinLength(1)
  @IsString()
  readonly password: string;

  @ApiProperty({
    type: 'string',
  })
  @IsEnum(UserType)
  readonly type?: UserType;
}
