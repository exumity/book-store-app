import {
  IsAlphanumeric,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserType } from '../../common/enums/user-type.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  @MaxLength(32)
  @MinLength(1)
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @MaxLength(32)
  @MinLength(1)
  @IsString()
  readonly password: string;

  @IsEnum(UserType)
  readonly type?: UserType;
}
