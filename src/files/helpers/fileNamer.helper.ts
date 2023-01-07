import { Request } from 'express';
import { v4 as uuid } from 'uuid';

export const fileNamer = (
  req: Request,
  file: Express.Multer.File,
  cb: Function,
) => {
  const fileExtName = file.originalname.split('.')[1];
  cb(null, `${uuid()}.${fileExtName}`);
};
