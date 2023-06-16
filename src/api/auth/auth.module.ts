import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/api/users/users.service';
import { UsersModule } from 'src/api/users/users.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [UsersModule],
})
export class AuthModule {}
