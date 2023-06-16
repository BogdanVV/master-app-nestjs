import { ParseArrayPipe, Post } from '@nestjs/common';
import {
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
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

// =======================================
// https://docs.nestjs.com/techniques/validation#stripping-properties
// =======================================

// =======================================
// export class UpdateUserDto extends OmitType(CreateUserDto, [
//   'email',
// ] as const) {}
// =======================================

// =======================================
// export class UpdateUserDto extends PartialType(CreateUserDto) {}
// =======================================

// =======================================
// export class UpdateUserDto extends PickType(CreateUserDto, [
//   'email',
// ] as const) {}
// =======================================

// =======================================
// export class FirstType {}
// export class SecondType {}
// export class CombinedType extends IntersectionType(FirstType, SecondType)
// =======================================

// ParseArrayPipe - to validate an array of some types like below
// for GET /?ids=1,2,3:
// @Get()
// async findByIds(
//   @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
//   ids: number[],
// ) {
//   return 'This action returns users by ids';
// }
