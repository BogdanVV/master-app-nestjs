import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(5)
  @MaxLength(20)
  name: string;

  @IsNotEmpty()
  password: string;

  @IsUrl()
  @IsOptional()
  avatarUrl?: string;
}
