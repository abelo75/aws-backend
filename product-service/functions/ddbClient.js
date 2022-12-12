import {DynamoDBClient} from "@aws-sdk/client-dynamodb";

const REGION = process.env.PROVIDER_REGION;
export const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE
export const STOCKS_TABLE = process.env.STOCKS_TABLE
// const REGION = 'eu-west-1';
export const ddbClient = new DynamoDBClient({region: REGION});

// export const uuidv4 = () => ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
export const uuidv4 = () => 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, () => {
  const r = Math.floor(Math.random() * 16);
  return r.toString(16);
});
