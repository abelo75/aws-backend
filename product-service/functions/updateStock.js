import {dbClient, PRODUCTS_TABLE, STOCKS_TABLE} from "./clients.js";
import {PutItemCommand, QueryCommand} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";

export const updateStock = async (event) => {
  const response = {
    statusCode: 400, error: null, body: 'Wrong parameters',
  }

  console.warn('Event', JSON.stringify(event));

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    body = {};
  }

  try {
    const ddbDocClient = DynamoDBDocumentClient.from(dbClient);
    const {productId} = event.pathParameters;
    const {count} = body;
    console.warn('Parameters:', JSON.stringify({count, productId}));
    if (!productId || !(typeof count === 'string' || typeof count === 'number')) {
      return response;
    }


    const productParams = {
      TableName: PRODUCTS_TABLE, KeyConditionExpression: "id = :s", ExpressionAttributeValues: {
        ":s": {S: productId}
      }
    }
    const products = await ddbDocClient.send(new QueryCommand(productParams));

    if (!products?.Items?.length) {
      response.statusCode = 404;
      response.body = 'Product not found';
      return response;
    }

    const stockParams = {
      TableName: STOCKS_TABLE, Item: {
        product_id: {S: productId}, count: {N: String(count)},
      }
    }

    await ddbDocClient.send(new PutItemCommand(stockParams));
    response.statusCode = 200;
    response.error = null;
    response.body = 'OK';
  } catch (e) {
    response.statusCode = 500;
    response.body = JSON.stringify({error: e?.message});
  }

  return response;

}
