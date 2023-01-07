import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: Function,
) => {
  if (!file) {
    cb(new Error('No se ha seleccionado ningun archivo!'), false);
  }

  if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestException(
        'Solo se aceptan imagenes formato jpg, jpeg, png o gif!',
      ),
      false,
    );
  }
};
