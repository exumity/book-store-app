import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../common/config/configuration';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayloadInterface } from './interfaces/access-token-payload.interface';
import { RefreshTokenPayloadInterface } from './interfaces/refresh-token-payload.interface';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<Configuration>,
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string) {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new BadRequestException('Username or password is invalid');
    }

    if (user?.password && !bcrypt.compareSync(pass, user.password)) {
      throw new UnauthorizedException();
    }

    return this.generateTokens(user);
  }

  async refreshAccessToken(oldRefreshToken: string) {
    const oldRefreshTokenPayload: RefreshTokenPayloadInterface =
      this.jwtService.verify(oldRefreshToken, {
        secret: this.configService.getOrThrow('jwtRefreshSecret', {
          infer: true,
        }),
      });

    const user = await this.usersService.findOne(oldRefreshTokenPayload.id);
    if (!user) {
      throw new UnauthorizedException();
    }

    return this.generateTokens(user);
  }

  generateTokens(user: User) {
    const payload: AccessTokenPayloadInterface = {
      username: user.username,
      id: user.id,
      claims: { userType: user.type },
    };
    const refreshPayload: RefreshTokenPayloadInterface = {
      username: user.username,
      id: user.id,
    };
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.getOrThrow('jwtAccessTtlInSeconds', {
          infer: true,
        }),
      }),
      refreshToken: this.jwtService.sign(refreshPayload, {
        secret: this.configService.getOrThrow('jwtRefreshSecret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('JwtRefreshTtlInSeconds', {
          infer: true,
        }),
      }),
    };
  }
}
