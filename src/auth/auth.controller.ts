import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { plainToInstance } from 'class-transformer';
import { TokensResponseDto } from './dto/tokens.response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto): Promise<TokensResponseDto> {
    return plainToInstance(
      TokensResponseDto,
      await this.authService.signIn(signInDto.username, signInDto.password),
    );
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshAccessToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<TokensResponseDto> {
    return plainToInstance(
      TokensResponseDto,
      await this.authService.refreshAccessToken(refreshTokenDto.refreshToken),
    );
  }
}
