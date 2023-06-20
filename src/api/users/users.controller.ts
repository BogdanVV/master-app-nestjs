import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReqWithUser } from '../../types';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { avatarStorageConfig } from 'src/utils/filesUploading';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findUserById(@Param('id') id: string) {
    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new NotFoundException('the user does not exist or was deleted');
    }

    return user;
  }

  @Get('')
  async getAllUsers(@Query('page') page: number, @Query('size') size: number) {
    return this.usersService.getAllUsers(page, size);
  }

  @Post('')
  @UseInterceptors(FileInterceptor('avatar'))
  async createUser(
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
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
  ) {
    return this.usersService.createUser(createUserDto, req, avatar);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('avatar', avatarStorageConfig))
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
    @Req() req: ReqWithUser,
  ) {
    if (Object.values(updateBody).length === 0 && !avatar) {
      throw new BadRequestException('the body is empty');
    }
    if (req.user.id !== id) {
      throw new UnauthorizedException(
        'you are not allowed to change the other user',
      );
    }

    let avatarUrl;
    if (avatar) {
      avatarUrl = `http://${
        req.headers.host
      }/uploads/avatars/${id}.${avatar.originalname.substring(
        avatar.originalname.lastIndexOf('.') + 1,
      )}`;
    }

    return this.usersService.updateUser(id, updateBody, avatarUrl);
  }

  // soft delete by setting `deleteAt` column to current date
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const result = await this.usersService.deleteUser(id);
    if (!result.affected) {
      throw new NotFoundException();
    }
  }

  // restoring the user by setting `deleteAt` column to null
  @Put('restore/:id')
  async restoreUser(@Param('id') id: string) {
    const result = await this.usersService.restoreUser(id);
    if (!result.affected) {
      throw new NotFoundException();
    }
  }
}
