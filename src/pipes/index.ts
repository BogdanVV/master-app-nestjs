import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class AvatarValidationPipe
  implements PipeTransform<Express.Multer.File, Express.Multer.File>
{
  transform(
    value: Express.Multer.File,
    metadata: ArgumentMetadata,
  ): Express.Multer.File {
    return value;
  }
}
