import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from './config';

let r2Client: S3Client | null = null;

function getR2Client(): S3Client {
  if (r2Client) {
    return r2Client;
  }

  const r2AccountId = env.R2_ACCOUNT_ID;
  const r2AccessKeyId = env.R2_ACCESS_KEY_ID;
  const r2SecretAccessKey = env.R2_SECRET_ACCESS_KEY;

  if (!r2AccountId || !r2AccessKeyId || !r2SecretAccessKey) {
    throw new Error('Missing required R2 environment variables: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY');
  }

  r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: r2AccessKeyId,
      secretAccessKey: r2SecretAccessKey,
    },
  });

  return r2Client;
}

export interface UploadFileToR2Options {
  file: Buffer;
  fileName: string;
  contentType: string;
  folder: 'products-images' | 'products-video';
}

export async function uploadFileToR2(options: UploadFileToR2Options): Promise<string> {
  const { file, fileName, contentType, folder } = options;

  const client = getR2Client();
  
  const r2BucketName = env.R2_BUCKET_NAME;
  const r2PublicDomain = env.R2_PUBLIC_DOMAIN;

  if (!r2BucketName || !r2PublicDomain) {
    throw new Error('Missing required R2 environment variables: R2_BUCKET_NAME, R2_PUBLIC_DOMAIN');
  }

  const key = `${folder}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: r2BucketName,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await client.send(command);

  const publicUrl = `${r2PublicDomain}/${key}`;
  return publicUrl;
}
