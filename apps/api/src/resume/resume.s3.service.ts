import { randomUUID } from "node:crypto";
import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { TResumeFileFormat } from "@moah/contracts/schema/resume";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

const UPLOAD_URL_EXPIRES_IN_SECONDS = 60 * 10;

export interface IResumeUploadUrl {
  key: string;
  uploadUrl: string;
  expiresIn: number;
}

export interface IResumeObjectMetadata {
  contentLength: number;
  contentType: string | undefined;
}

@Injectable()
export class ResumeS3Service {
  private readonly bucketName: string;
  private readonly s3Client: S3Client;

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.getOrThrow<string>(
      "AWS_S3_RESUME_BUCKET",
    );
    this.s3Client = new S3Client({
      region: this.configService.getOrThrow<string>("AWS_REGION"),
    });
  }

  async createUploadUrl(
    userId: string,
    fileFormat: TResumeFileFormat,
    contentType: string,
  ): Promise<IResumeUploadUrl> {
    const key = this.createObjectKey(userId, fileFormat);
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });
    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: UPLOAD_URL_EXPIRES_IN_SECONDS,
    });

    return {
      key,
      uploadUrl,
      expiresIn: UPLOAD_URL_EXPIRES_IN_SECONDS,
    };
  }

  async getObjectMetadata(
    s3Key: string,
  ): Promise<IResumeObjectMetadata | null> {
    try {
      const result = await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: s3Key,
        }),
      );

      return {
        contentLength: result.ContentLength ?? 0,
        contentType: result.ContentType,
      };
    } catch (error) {
      if (
        error instanceof S3ServiceException &&
        error.$metadata.httpStatusCode === 404
      ) {
        return null;
      }

      throw error;
    }
  }

  async deleteObject(s3Key: string) {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
      }),
    );
  }

  private createObjectKey(
    userId: string,
    fileFormat: TResumeFileFormat,
  ): string {
    return `resumes/${userId}/${randomUUID()}.${fileFormat.toLowerCase()}`;
  }
}
