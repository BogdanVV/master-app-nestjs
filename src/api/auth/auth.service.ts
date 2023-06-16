import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/LoginDto';

@Injectable()
export class AuthService {
  async login(loginDto: LoginDto) {
    // TODO: save user in db
    return `email: ${loginDto.email}, password: ${loginDto.password}`;
  }

  async signUp() {
    return '';
  }
}
