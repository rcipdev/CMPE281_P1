import { IsEmail, IsNotEmpty } from 'class-validator';

export class DownloadFileDto {
  @IsNotEmpty()
  bucketName: string;

  @IsNotEmpty()
  key: string;
}
