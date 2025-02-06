import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class ImagesService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.get('CLOUDINARY_API_KEY'),
      api_secret: configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async listImages(): Promise<string[]> {
    try {
      const result = await cloudinary.api.resources();
      return result.resources.map((resource) => resource.url);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException(
        'Failed to list images',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getImage(publicId: string): Promise<string> {
    try {
      const result = await cloudinary.api.resource(publicId);
      return result.secure_url;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException(
        'Failed to delete image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
