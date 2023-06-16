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
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'postgres',
      entities: [User],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
