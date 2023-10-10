import { IsEmail, IsNotEmpty } from 'class-validator';

export class AWSConfigDto {
  @IsNotEmpty()
  bucketName: string;

  @IsNotEmpty()
  fileType: string;

  @IsNotEmpty()
  desc: string;

  @IsNotEmpty()
  key: string;
}
