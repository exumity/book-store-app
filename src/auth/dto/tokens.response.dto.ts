import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TokensResponseDto {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
