import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/LoginDto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { omitProp } from 'src/utils';
import { JwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // TODO: any
  async login(loginDto: LoginDto): Promise<{ accessToken: string; user: any }> {
    // TODO: save user in db
    const user = await this.usersService.getUserByEmail(loginDto.email);
    if (!user) {
      throw new NotFoundException('the user does not exist or was deleted');
    }

    const isPasswordsMatch = bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordsMatch) {
      throw new UnauthorizedException('invalid credentials');
    }
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        name: user.name,
        iat: dayjs(new Date()).unix(),
      },
      { secret: process.env.JWT_SECRET, expiresIn: '30d' },
    );

    return { user: omitProp(user, ['password']), accessToken };
  }

  async signUp() {
    return '';
  }
}
