import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateStoreDto {
  @MaxLength(128)
  @IsString()
  @IsNotEmpty()
  name: string;
}
