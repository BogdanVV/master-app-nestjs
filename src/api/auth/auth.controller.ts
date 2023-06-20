import {
  Body,
  Controller,
  FileTypeValidator,
  HttpCode,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SignUpDto } from './dto/SignUpDto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/LoginDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from 'src/api/users/users.service';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
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
          new MaxFileSizeValidator({ maxSize: 2000000 }), // 2MB
        ],
        fileIsRequired: false,
      }),
    )
    avatar: Express.Multer.File,
    @Body() createUserDto: SignUpDto,
    @Req() req: Request,
  ): Promise<string> {
    return this.usersService.createUser(createUserDto, req, avatar);
  }
}
