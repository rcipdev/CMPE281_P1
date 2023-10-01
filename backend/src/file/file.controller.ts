import {
  Controller,
  Delete,
  Get,
  Param,
  UseGuards,
  Request,
  Post,
  Body,
} from '@nestjs/common';
import { FileService } from './file.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { DownloadFileDto } from './dto/downloadFile.dto';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Get(':bucket/:key')
  @UseGuards(AuthGuard)
  async getPresignedUploadUrl(
    @Param('bucket') bucket: string,
    @Param('key') key: string,
  ): Promise<string> {
    return await this.fileService.getPresignedUploadUrl(bucket, key);
  }

  @Post('upload')
  @UseGuards(AuthGuard)
  async uploadObject(@Body() data: any, @Request() req) {
    return this.fileService.upload(data.key, req.user);
  }

  @Post('download')
  @UseGuards(AuthGuard)
  async downloadObject(@Body() data: DownloadFileDto): Promise<any> {
    return this.fileService.downloadObjects(data.bucketName, data.key);
  }

  @Delete('delete/:bucketName/:objectKey')
  @UseGuards(AuthGuard)
  async deleteObject(
    @Param('bucketName') bucketName: string,
    @Param('objectKey') objectKey: string,
  ): Promise<void> {
    await this.fileService.deleteObject(bucketName, objectKey);
  }
}
