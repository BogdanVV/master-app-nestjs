import {
  Body,
  Controller,
  FileTypeValidator,
  HttpCode,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SignUpDto } from './dto/SignUpDto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/LoginDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from 'src/api/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<string> {
    return this.authService.login(loginDto);
  }

  @Post('sign-up')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('avatar'))
  async signUp(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /jpg|jpeg|png$/ }),
          new MaxFileSizeValidator({ maxSize: 2000000 }),
        ],
        fileIsRequired: false,
      }),
    )
    avatar: Express.Multer.File,
    @Body() createUserDto: SignUpDto,
  ): Promise<string> {
    return this.usersService.createUser(createUserDto, avatar);
  }

  // ============================
  // Type 'typeof AvatarValidationPipe' is missing the following properties from type
  // 'FileValidator<Record<string, any>>': validationOptions, isValid, buildErrorMessage
  // ts(2739)
  // ============================
  // @Post('sign-up2')
  // @HttpCode(201)
  // @UseInterceptors(FileInterceptor('avatar'))
  // async signUp2(
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [AvatarValidationPipe],
  //     }),
  //   )
  //   avatar: Express.Multer.File,
  //   @Body() createUserDto: SignUpDto,
  // ): Promise<IUser> {
  //   if (avatar) {
  //     console.log('avatar>>>', avatar);
  //   } else {
  //     console.log('no avatar provided');
  //   }

  //   console.log('createUserDto>>>', createUserDto);
  //   const user = await this.usersService.createUser(createUserDto, avatar);

  //   return user;
  // }
}
