import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUserDto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './entities/User';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { Request } from 'express';
import * as fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
    req: Request,
    avatar?: Express.Multer.File,
  ): Promise<string> {
    // hash password before saving into db
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.password = hashedPassword;

    const newUuid = uuidv4();

    if (avatar) {
      const fileName = `${newUuid}.${avatar.originalname.substring(
        avatar.originalname.lastIndexOf('.') + 1,
      )}`;
      createUserDto.avatarUrl = `http://${req.headers.host}/uploads/avatars/${fileName}`;

      await fs.writeFile(
        `uploads/avatars/${fileName}`,
        avatar.buffer,
        (err) => {
          if (err) {
            throw new InternalServerErrorException('failed to upload avatar');
          }
        },
      );
    }

    await this.usersRepo.insert({
      id: newUuid,
      ...createUserDto,
    });

    return newUuid;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.usersRepo.findOne({
      where: { id },
    });
  }

  // for login
  async getUserByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({
      where: { email },
      select: [
        'id',
        'avatarUrl',
        'email',
        'name',
        'password',
        'isActive',
        'roles',
        'updatedAt',
        'createdAt',
        'deleteAt',
      ],
    });
  }

  async updateUser(
    id: string,
    updateBody: UpdateUserDto,
    avatarUrl?: string,
  ): Promise<User | null> {
    // check if user exists
    await this.getUserById(id);

    const result = await this.usersRepo.update(id, {
      ...updateBody,
      ...(avatarUrl && { avatarUrl }),
    });
    if (result.affected === 1) {
      return this.usersRepo.findOne({ where: { id } });
    } else {
      throw new InternalServerErrorException(
        'unknown error while updating the user. check the logs',
      );
    }
  }

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

  async deleteUser(id: string): Promise<UpdateResult> {
    return this.usersRepo.softDelete(id);
  }

  async restoreUser(id: string): Promise<UpdateResult> {
    return this.usersRepo.restore(id);
  }
}
