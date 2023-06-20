import { diskStorage } from 'multer';

export const avatarStorageConfig = {
  storage: diskStorage({
    destination: 'uploads/avatars',
    filename: (req, file, cb) => {
      // fileName = `userId.fileExt`
      const fileName = `${req.params.id}.${file.originalname.substring(
        file.originalname.lastIndexOf('.') + 1,
      )}`;

      // save file into `destination`
      cb(null, fileName);
    },
  }),
};
