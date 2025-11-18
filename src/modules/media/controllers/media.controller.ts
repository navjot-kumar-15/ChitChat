import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('media')
export class MediaController {
  constructor() {}

  @Post('single')
  @UseInterceptors(FileInterceptor('image'))
  upload_single_file(@UploadedFile() file: Express.Multer.File) {
    try {
      return {
        success: true,
        statusCode: 200,
        file,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 400,
        message: error.message,
      };
    }
  }

  @Post('bulk')
  @UseInterceptors(FilesInterceptor('images'))
  upload_multiple_files(@UploadedFiles() files: Array<Express.Multer.File>) {
    try {
      return {
        success: true,
        statusCode: 200,
        files,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 400,
        message: error.message,
      };
    }
  }
}
