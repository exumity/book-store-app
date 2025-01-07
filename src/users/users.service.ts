import { ConflictException, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserType } from '../common/enums/user-type.enum';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findOneByUsername(createUserDto.username);

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    return this.userRepository.save({
      ...createUserDto,
      password: bcrypt.hashSync(createUserDto.password, 10),
    });
  }

  async findAll(skip: number, take: number) {
    return this.userRepository.find({ skip, take });
  }

  async findOne(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async findOneByUsername(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(
      { id },
      {
        type: updateUserDto.type,
      },
    );
  }

  async remove(id: string) {
    return this.userRepository.delete({ id: id });
  }

  async onModuleInit() {
    const existingAdminUser = await this.userRepository.findOne({
      where: { username: 'admin' },
    });
    const existingStoreManagerUser = await this.userRepository.findOne({
      where: { username: 'store_manager' },
    });
    const existingTestUser = await this.userRepository.findOne({
      where: { username: 'test_user' },
    });

    if (!existingAdminUser) {
      await this.create({
        username: 'admin',
        password: 'admin',
        type: UserType.ADMIN,
      });
    }

    if (!existingStoreManagerUser) {
      await this.create({
        username: 'store_manager',
        password: 'store_manager',
        type: UserType.STORE_MANAGER,
      });
    }

    if (!existingTestUser) {
      await this.create({
        username: 'test_user',
        password: 'test_user',
        type: UserType.USER,
      });
    }
  }
}
