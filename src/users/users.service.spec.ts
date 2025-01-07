import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { ConflictException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserType } from '../common/enums/user-type.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { faker } from '@faker-js/faker';

const createMockUser = (overrides?: Partial<User>): User => ({
  id: faker.string.uuid(),
  username: faker.internet.username(),
  password: faker.internet.password(),
  type: faker.helpers.arrayElement([UserType.ADMIN, UserType.USER]),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
});
const createMockUsers = (count: number): User[] => {
  return Array.from({ length: count }).map(() => createMockUser());
};

describe('UsersService', () => {
  let service: UsersService;
  let spyUserRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: () => ({
            create: jest.fn((entity) => entity),
          }),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    spyUserRepository = module.get(getRepositoryToken(User));
  });

  describe('create', () => {
    let createUserDto: CreateUserDto;
    let mockUser: User;
    beforeEach(() => {
      createUserDto = {
        username: 'test',
        password: 'test_pass',
      };
      mockUser = createMockUser();
    });
    it('should throw ConflictException on creating', async () => {
      spyUserRepository.findOneBy = jest.fn().mockReturnValue(mockUser);

      await expect(
        async () =>
          await service.create({
            password: createUserDto.password,
            username: createUserDto.username,
          }),
      ).rejects.toThrow(ConflictException);

      expect(spyUserRepository.findOneBy).toHaveBeenCalledTimes(1);
    });

    it('should user created successfully', async () => {
      spyUserRepository.findOneBy = jest.fn().mockReturnValue(null);
      spyUserRepository.save = jest.fn().mockReturnValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result).toBe(mockUser);
    });
  });

  describe('findAll', () => {
    let users: User[];
    beforeEach(() => {
      users = createMockUsers(5);
    });
    it('should return user array', async () => {
      spyUserRepository.find = jest.fn(async () => users);

      const result = await service.findAll(0, 5);

      expect(result).toBe(users);
    });
  });

  describe('finding user', () => {
    let user: User;
    beforeEach(() => {
      user = createMockUser();
    });
    it('should return null', async () => {
      spyUserRepository.findOneBy = jest.fn(async () => null);

      const result = await service.findOne(user.id);

      expect(result).toBe(null);
    });

    it('should return a user', async () => {
      spyUserRepository.findOneBy = jest.fn(async () => user);

      const result = await service.findOne(user.id);

      expect(result).toBe(user);
    });

    it('should return null by username', async () => {
      spyUserRepository.findOneBy = jest.fn(async () => null);

      const result = await service.findOneByUsername(user.id);

      expect(result).toBe(null);
    });

    it('should return a user by username', async () => {
      spyUserRepository.findOneBy = jest.fn(async () => user);

      const result = await service.findOneByUsername(user.id);

      expect(result).toBe(user);
    });
  });

  describe('update', () => {
    let user: User;
    beforeEach(() => {
      user = createMockUser();
    });

    it('should user updated', async () => {
      spyUserRepository.update = jest.fn();

      await service.update(user.id, {
        type: UserType.STORE_MANAGER,
      });

      expect(spyUserRepository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    let user: User;
    beforeEach(() => {
      user = createMockUser();
    });

    it('should user removed', async () => {
      spyUserRepository.delete = jest.fn().mockReturnValue(user);

      const result = await service.remove(user.id);

      expect(result).toBe(user);
      expect(spyUserRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
