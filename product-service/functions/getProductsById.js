import {DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";
import {QueryCommand} from '@aws-sdk/client-dynamodb';
import {dbClient, PRODUCTS_TABLE, STOCKS_TABLE} from "./clients.js";

export const getProductsById = async (event) => {

  const {productId} = event.pathParameters;
  console.log('Event', event);
  const ddbDocClient = DynamoDBDocumentClient.from(dbClient);
  let data;
  const response = {
    statusCode: 200,
    error: null,
  }

  try {
    const productParams = {
      TableName: PRODUCTS_TABLE ?? 'products',
      KeyConditionExpression: "id = :s",
      ExpressionAttributeValues: {
        ":s": {S: productId}
      }
    }
    const products = await ddbDocClient.send(new QueryCommand(productParams));

    const stockParams = {
      TableName: STOCKS_TABLE ?? 'stocks',
      KeyConditionExpression: "product_id = :s",
      ExpressionAttributeValues: {
        ":s": {S: productId}
      }
    }

    const stocks = await ddbDocClient.send(new QueryCommand(stockParams));
    data = products?.Items?.map?.(
      ({id, description, title, price, priority, power, placeId}) => (
        {
          id: id?.S,
          description: description?.S,
          title: title?.S,
          power: Number(power?.N),
          price: Number(price?.N),
          placeId: placeId?.S,
          priority: Number(priority?.N),
          count: Number(stocks?.Items?.find(({product_id}) => product_id?.S === id?.S)?.count?.N ?? 0)
        }));
    if (!data.length) {
      response.statusCode = 404;
      response.messgae = 'Product not found';
    }
  } catch (e) {
    console.log('Error get items', e);
    response.statusCode = 500;
    response.error = e?.message;
  }
  response.body = JSON.stringify(data[0] ?? {});
  return response;
};
