import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOption } from './multer.options';
import { Express } from 'express';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('file-upload')
  @UseInterceptors(FileInterceptor('file', multerOption))
  fileUpload(@UploadedFile() file: Express.Multer.File) {
    return `${file.originalname} File uploaded check http://localhost:3000/uploads/${file.filename}`;
  }
}
