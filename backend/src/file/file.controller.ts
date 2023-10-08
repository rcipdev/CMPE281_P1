import {
  Controller,
  Delete,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
} from '@nestjs/common';
import { FileService } from './file.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { AWSConfigDto } from './dto/awsconfig.dto';
import { File } from 'src/database/enitities/file.entity';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Get('')
  @UseGuards(AuthGuard)
  async getAllFiles(@Request() req): Promise<File[]> {
    return await this.fileService.getAllFiles(req.user);
  }

  @Post('url')
  @UseGuards(AuthGuard)
  async getPresignedUploadUrl(@Body() data: AWSConfigDto): Promise<string> {
    return await this.fileService.getPresignedUploadUrl(
      data.bucketName,
      data.key,
    );
  }

  @Post('save')
  @UseGuards(AuthGuard)
  async uploadObject(@Body() data: AWSConfigDto, @Request() req) {
    return this.fileService.upload(data.key, req.user);
  }

  @Delete('delete')
  @UseGuards(AuthGuard)
  async deleteObject(
    @Body() data: AWSConfigDto,
    @Request() req,
  ): Promise<void> {
    await this.fileService.deleteObject(data.bucketName, data.key, req.user.id);
  }
}
