import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUserDto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/User';
import { UpdateUserDto } from './dto/UpdateUserDto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
    avatar?: Express.Multer.File,
  ): Promise<string> {
    // hash password before saving into db
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.password = hashedPassword;

    // TODO: handle avatar if provided
    if (avatar) {
      createUserDto.avatarUrl = `somesite.com/${avatar.originalname}`;
    }

    const result = await this.usersRepo.insert(createUserDto);

    return result.identifiers?.[0]?.id;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('the user does not exist');
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.usersRepo.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async updateUser(
    id: string,
    updateBody: UpdateUserDto,
    avatar?: Express.Multer.File,
  ): Promise<User | null> {
    // check if user exists
    await this.getUserById(id);

    // TODO: process file if provided
    const result = await this.usersRepo.update(id, {
      ...updateBody,
      ...(avatar && { avatarUrl: `somesite.com/${avatar.originalname}` }),
    });
    console.log('result>>>', result);
    if (result.affected === 1) {
      console.log('********************************************');

      return this.usersRepo.findOne({ where: { id } });
    } else {
      throw new InternalServerErrorException();
    }
  }

  // TODO: protect with guard for user roles
  async getAllUsers(page: number, size: number): Promise<User[]> {
    const users = await this.usersRepo.find({
      take: size,
      skip: (page - 1) * size,
      order: {
        createdAt: 'asc',
      },
    });

    return users;
  }
}
