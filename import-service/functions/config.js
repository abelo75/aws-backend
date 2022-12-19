import {S3Client} from "@aws-sdk/client-s3";

export const REGION = process.env.REGION ?? 'eu-west-1';
export const BUCKET = process.env.BUCKET ?? '';
export const PREFIX = process.env.UPLOAD_PREFIX ?? '';
export const PARSED_PREFIX = process.env.PARSED_PREFIX ?? '';

export const s3Client = new S3Client({region: REGION});
