import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { FilesService } from "./files.service";
import { fileFilter, fileNamer } from "./helpers";
import { BadRequestException } from "@nestjs/common";
import { diskStorage } from "multer";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";

@Controller("files")
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Get("product/:imageName")
  findProductImage(
    @Res() res: Response,
    @Param("imageName") imageName: string
  ) {
    const path = this.filesService.getStaticProductImage(imageName);
    res.sendFile(path);
  }

  @Post("product")
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: fileFilter,
      limits: { fileSize: 1024 * 1024 * 5, files: 1, fields: 1, parts: 2 },
      storage: diskStorage({
        destination: "./static/products",
        filename: fileNamer,
      }),
    })
  )
  uploadProductImage(
    @UploadedFile()
    file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException("No se ha seleccionado ningun archivo!");
    }

    const secureURL = `${this.configService.get("HOST_API")}/files/product/${
      file.filename
    }`;

    return {
      secure_url: secureURL,
      file_name: file.filename,
    };
  }
}
