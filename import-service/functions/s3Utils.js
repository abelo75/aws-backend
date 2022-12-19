import {BUCKET, s3Client} from "./config";
import {CopyObjectCommand, DeleteObjectCommand} from "@aws-sdk/client-s3";

export const copyObject = async (src, dst, log = true) => {
  !!log && console.log(`Copy from `, JSON.stringify({src, dst}));
  try {
    const command = new CopyObjectCommand({
      Bucket: BUCKET,
      Key: dst,
      CopySource: src,
    });
    const res = await s3Client.send(command);
    !!log && console.log('Copy success', res);
    return res;
  } catch (e) {
    console.warn('Error copy', e?.message ?? JSON.stringify(e));
  }
}

export const removeObject = async (key, log = true) => {
  try {
    !!log && console.log(`Delete `, JSON.stringify(key));
    const data = await s3Client.send(new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key
    }));
    !!log && console.log('Delete successful');
    return data;
  } catch (e) {
    console.warn('Error delete', JSON.stringify(e?.message));
  }
  return undefined;
}
