import {PutObjectCommand} from '@aws-sdk/client-s3'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {BUCKET, PREFIX, s3Client} from "./config";

const getResponse = (response, body) => {
  if (body) {
    response.body = body;
  }
  response.body = JSON.stringify(response.body ?? {});
  return response;
}

export const importProductsFile = async (event) => {
  console.log('Event', JSON.stringify(event));
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
    }
  }
  let name = '';
  try {
    name = event.queryStringParameters.name;
    if (!name) {
      response.statusCode = 400;
      response.body = "Bad parameters. Required name parameter in query";
      return getResponse(response)
    }
  } catch (e) {
    console.log('Error get parameters', JSON.stringify(e));
    response.statusCode = 400;
    return getResponse(response);
  }

  const s3Parameters = {
    Bucket: BUCKET,
    ContentType: 'text/csv',
    Key: `${PREFIX}${name}`,
  }

  try {
    const command = new PutObjectCommand(s3Parameters);
    response.body = await getSignedUrl(s3Client, command);
  } catch (e) {
    console.warn('Error generate signed URL', JSON.stringify(e));
    response.statusCode = 500;
  }


  // console.log('Response', JSON.stringify(response));

  return getResponse(response);
}
