import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateBookDto {
  @MaxLength(256)
  @IsString()
  @IsNotEmpty()
  name: string;

  @MaxLength(64)
  @IsString()
  @IsNotEmpty()
  publisher: string;

  @IsInt()
  @IsNotEmpty()
  isbn: string;
}
