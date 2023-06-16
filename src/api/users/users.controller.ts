import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Get('')
  async getAllUsers(@Query('page') page: number, @Query('size') size: number) {
    return this.usersService.getAllUsers(page, size);
  }

  @Post('')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUser(
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
    @Param('id') id: string,
    @Body() updateBody: UpdateUserDto,
  ) {
    if (Object.values(updateBody).length === 0 && !avatar) {
      throw new BadRequestException('the body is empty');
    }

    return this.usersService.updateUser(id, updateBody, avatar);
  }
}
