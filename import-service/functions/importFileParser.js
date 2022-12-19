import {GetObjectCommand} from '@aws-sdk/client-s3';
import {BUCKET, PARSED_PREFIX, PREFIX, s3Client} from "./config";
import {pipeline} from 'stream';
import csv from 'csv-parser';
import {copyObject, removeObject} from "./s3Utils";
import {putToProductDb} from "./dbUtils";


const parseObject = async (key, onTransformComplete) => {
  const data = (await s3Client.send(new GetObjectCommand({Bucket: BUCKET, Key: key})));
  const inputStream = data.Body;
  const result = [];
  pipeline(
    inputStream,
    csv()
      .on('data', d => {
        result.push(d);
        console.log('Parsed data', JSON.stringify(d));
      }),
    async (error) => {
      if (error) {
        console.log('Error pipeline', JSON.stringify(error));
      }
      if (typeof onTransformComplete === 'function') {
        onTransformComplete(result);
      }
    });
}

export const importFileParser = (event) => {

  console.log('Event', JSON.stringify(event));

  try {
    const objectList = event?.Records?.filter?.(record => record?.s3?.object?.key?.startsWith(PREFIX)) ?? [];
    for (const obj of objectList) {
      const key = obj?.s3?.object?.key;
      if (!key) {
        continue;
      }
      const src = `${BUCKET}/${key}`;
      const dst = `${PARSED_PREFIX}${key.substring(PREFIX.length)}`;
      console.log('Handle ', JSON.stringify({src, dst}));
      parseObject(key, async (result) => {
        await putToProductDb(result);
        await copyObject(src, dst)
        await removeObject(key);
      });

    }
  } catch (e) {
    console.warn('Error get list from event', e?.message);
  }

}
