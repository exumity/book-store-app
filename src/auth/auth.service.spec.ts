import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { UserType } from '../common/enums/user-type.enum';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

const createMockUser = (overrides?: Partial<User>): User => ({
  id: faker.string.uuid(),
  username: faker.internet.username(),
  password: bcrypt.hashSync(overrides?.password || 'test', 10),
  type: UserType.USER,
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
});

describe('AuthService', () => {
  let service: AuthService;
  let spyUserRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useFactory: () => ({
            getOrThrow: jest.fn(),
          }),
        },
        {
          provide: JwtService,
          useFactory: () => ({
            sign: jest.fn().mockReturnValue('token'),
          }),
        },
        UsersService,
        AuthService,
        {
          provide: getRepositoryToken(User),
          useFactory: () => ({}),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    spyUserRepository = module.get(getRepositoryToken(User));
  });

  it('should be signed in successfully ', async () => {
    const user = createMockUser();
    spyUserRepository.findOneBy = jest.fn().mockReturnValue(user);

    const result = await service.signIn(user.username, 'test');
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });
});
