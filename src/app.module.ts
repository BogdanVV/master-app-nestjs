import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { UsersModule } from './api/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './api/users/entities/User';
import 'dotenv/config';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password123',
      database: 'postgres',
      entities: [User],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
