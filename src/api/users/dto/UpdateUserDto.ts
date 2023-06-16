import {
  IsBooleanString,
  IsDateString,
  IsEmail,
  IsOptional,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @MinLength(5)
  @MaxLength(20)
  name: string;

  @IsOptional()
  @MinLength(5)
  @MaxLength(20)
  password: string;

  @IsOptional()
  @IsBooleanString()
  isActive?: boolean;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @IsOptional()
  @IsDateString()
  deleteAt: string;
}
