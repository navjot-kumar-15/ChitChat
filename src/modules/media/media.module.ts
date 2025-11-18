import { Module } from '@nestjs/common';
import { MediaController } from './controllers/media.controller';
import { MediaService } from './services/media.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/images', // better folder name (plural)
        filename: (req, file, callback) => {
          // Generate unique filename: timestamp + random suffix + original extension
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          console.log('Test file: ', filename);
          callback(null, filename);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB limit (adjust as needed)
      },
      fileFilter: (req, file, callback) => {
        // Optional: allow only images
        if (
          !file.originalname.match(/\.(jpg|jpeg|png|gif|webp|pdf|mp4|webm)$/i)
        ) {
          return callback(
            new Error('Only image/video/pdf files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
