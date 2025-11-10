import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const r2AccountId = process.env.R2_ACCOUNT_ID;
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const r2BucketName = process.env.R2_BUCKET_NAME;
const r2PublicDomain = process.env.R2_PUBLIC_DOMAIN;

if (!r2AccountId || !r2AccessKeyId || !r2SecretAccessKey || !r2BucketName || !r2PublicDomain) {
  throw new Error('Missing required R2 environment variables: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_DOMAIN');
}

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: r2AccessKeyId,
    secretAccessKey: r2SecretAccessKey,
  },
});

export interface UploadFileToR2Options {
  file: Buffer;
  fileName: string;
  contentType: string;
  folder: 'products-images' | 'products-video';
}

export async function uploadFileToR2(options: UploadFileToR2Options): Promise<string> {
  const { file, fileName, contentType, folder } = options;

  const key = `${folder}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: r2BucketName,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await r2Client.send(command);

  const publicUrl = `${r2PublicDomain}/${key}`;
  return publicUrl;
}
