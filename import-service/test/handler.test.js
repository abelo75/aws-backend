jest.mock('@aws-sdk/s3-request-presigner');
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {importProductsFile} from "../handler";

jest.mock('@aws-sdk/client-s3');

describe('Test lambda handlers', () => {
  const getSignedUrlMock = getSignedUrl;
  let result;
  getSignedUrlMock.mockResolvedValue("example-url.com");
  test('importProductsFile', async () => {
    result = await importProductsFile({queryStringParameters: {name: 'TestFile.csv'}});
    expect(result).toMatchObject({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      }, body: '"example-url.com"'
    });
  });
  test('importProductsFile wrong parameters', async () => {
    result = await importProductsFile({queryStringParameters: {name1: 'TestFile.csv'}});
    expect(result).toMatchObject({
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: '"Bad parameters. Required name parameter in query"'
    });
  });
});
