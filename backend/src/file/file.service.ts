import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as AWS from 'aws-sdk';
import { File } from 'src/database/enitities/file.entity';
import { User } from 'src/database/enitities/user.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { roles } from 'src/constants/roles';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class FileService {
  private s3: AWS.S3;

  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
    private userService: AuthService,
  ) {
    this.s3 = new AWS.S3();
  }

  async getAllFiles(user: User): Promise<File[]> {
    try {
      let files: File[];
      if (user.role.roleName == roles.ADMIN)
        files = await this.filesRepository.find();
      else
        files = await this.filesRepository.find({
          where: { user: { id: user.id } },
        });
      if (files.length == 0) return [];
      return files;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async getPresignedUploadUrl(
    bucketName: string,
    key: string,
  ): Promise<string> {
    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: 3600,
      ContentType: 'application/pdf',
    };

    return new Promise((resolve, reject) => {
      this.s3.getSignedUrl('putObject', params, (err, url) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);
        }
      });
    });
  }

  async upload(key: string, user: User) {
    try {
      let file = await this.filesRepository.findOne({
        where: {
          name: key,
          user: { id: user.id },
        },
      });
      let usr = await this.userService.getUser(user.id);
      if (!file && usr) {
        let newFile = new File();
        newFile.name = key;
        newFile.user = usr;
        await this.filesRepository.save(newFile);
      }
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async deleteObject(
    bucketName: string,
    objectKey: string,
    userId: number,
  ): Promise<void> {
    try {
      const params: AWS.S3.DeleteObjectRequest = {
        Bucket: bucketName,
        Key: objectKey,
      };
      await this.s3.deleteObject(params).promise();
      let file = await this.filesRepository.findOne({
        where: { name: objectKey, user: { id: userId } },
      });
      if (file) await this.filesRepository.delete(file.id);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async downloadObjects(bucketName: string, objectKey: string): Promise<any> {
    // const params: AWS.S3.GetObjectRequest = {
    //   Bucket: bucketName,
    //   Key: objectKey,
    // };

    // const s3PresignedUrl = await this.s3.getSignedUrlPromise(
    //   'getObject',
    //   params,
    // );
    const cloudFrontDomain = process.env.CLOUD_FRONT_DOMAIN;
    const cloudFrontUrl = `https://${cloudFrontDomain}/${bucketName}/${objectKey}`;

    // Use Axios to fetch the file from CloudFront
    const response = await axios.get(cloudFrontUrl, { responseType: 'stream' });

    return response.data;
    // return `${cloudFrontUrl}?${s3PresignedUrl.split('?')[1]}`;
  }
}
