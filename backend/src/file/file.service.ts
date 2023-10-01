import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as AWS from 'aws-sdk';
import { File } from 'src/database/enitities/file.entity';
import { User } from 'src/database/enitities/user.entity';
import { Repository } from 'typeorm';
import axios from 'axios';

@Injectable()
export class FileService {
  private s3: AWS.S3;

  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
  ) {
    this.s3 = new AWS.S3();
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
          user,
        },
      });
      if (file) {
        //TODO
        //delete prev obj and update
      } else {
        let newFile = new File();
        newFile.name = key;
        newFile.user = user;
        await this.filesRepository.save(newFile);
      }
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async deleteObject(bucketName: string, objectKey: string): Promise<void> {
    try {
      const params: AWS.S3.DeleteObjectRequest = {
        Bucket: bucketName,
        Key: objectKey,
      };
      await this.s3.deleteObject(params).promise();
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async getObjects(user: User): Promise<File[]> {
    try {
      let files = await this.filesRepository.find({ where: { user } });
      if (files.length == 0) {
        throw new NotFoundException('No files found');
      }
      return files;
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
