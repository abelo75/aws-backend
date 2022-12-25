import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {SNSClient} from '@aws-sdk/client-sns'
import {DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";

const REGION = process.env.PROVIDER_REGION;
export const TOPIC = process.env.TOPIC_ARN;
export const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE
export const STOCKS_TABLE = process.env.STOCKS_TABLE
// const REGION = 'eu-west-1';
export const dbClient = new DynamoDBClient({region: REGION});
const marshallOptions = {
  convertEmptyValues: false,
  removeUndefinedValues: false,
  convertClassInstanceToMap: false,
};

const unmarshallOptions = {
  wrapNumbers: false,
};

const translateConfig = {marshallOptions, unmarshallOptions};

export const ddbDocClient = DynamoDBDocumentClient.from(dbClient, translateConfig);

export const snsClient = new SNSClient({region: REGION});

export const uuidv4 = () => 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, () => {
  const r = Math.floor(Math.random() * 16);
  return r.toString(16);
});
