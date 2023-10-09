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
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      signatureVersion: 'v4',
    });
  }

  async getAllFiles(user: User): Promise<any> {
    try {
      let files: File[];
      if (user.role.roleName == roles.ADMIN)
        files = await this.filesRepository.find({
          relations: { user: true },
        });
      else
        files = await this.filesRepository.find({
          where: { user: { id: user.id } },
          relations: { user: true },
          select: { user: { firstName: true, lastName: true, email: true } },
        });
      if (files.length == 0) return [];
      return this.getObjectsFromS3(files);
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

  async upload(key: string, fileType: string, user: User) {
    try {
      const file = await this.filesRepository.findOne({
        where: {
          name: key,
          user: { id: user.id },
        },
      });
      const usr = await this.userService.getUser(user.id);
      if (!file && usr) {
        const newFile = new File();
        newFile.name = key;
        newFile.user = usr;
        newFile.fileType = fileType;
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
      const file = await this.filesRepository.findOne({
        where: { name: objectKey, user: { id: userId } },
      });
      if (file) await this.filesRepository.delete(file.id);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async getObjectsFromS3(keys: File[]): Promise<any> {
    try {
      const cloudFrontDomain = process.env.CLOUD_FRONT_ORIGIN;
      const response: any[] = [];
      for (let i = 0; i < keys.length; i++) {
        const cloudFrontUrl = `${cloudFrontDomain}/${keys[i].name}`;
        await axios
          .get(cloudFrontUrl, {
            responseType: 'arraybuffer',
          })
          .then((obj) => {
            response.push({
              id: keys[i].id,
              user: keys[i].user,
              name: keys[i].name,
              desc: keys[i].description,
              fileType: keys[i].fileType,
              createdAt: keys[i].createdAt,
              updatedAt: keys[i].updatedAt,
              fileData: obj.data,
            });
          });
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}
