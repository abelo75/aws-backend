import {DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";
import {ScanCommand} from '@aws-sdk/client-dynamodb';
import {ddbClient, PRODUCTS_TABLE, STOCKS_TABLE} from "./ddbClient.js";

export const getProductsList = async () => {

  const marshallOptions = {
    convertEmptyValues: false,
    removeUndefinedValues: false,
    convertClassInstanceToMap: false,
  };

  const unmarshallOptions = {
    wrapNumbers: false,
  };

  const translateConfig = {marshallOptions, unmarshallOptions};

  const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, translateConfig);

  let data;
  const response = {
    statusCode: 200,
    error: null,
  }

  try {
    const products = await ddbDocClient.send(new ScanCommand({TableName: PRODUCTS_TABLE}));
    const stocks = await ddbDocClient.send(new ScanCommand({TableName: STOCKS_TABLE}));
    data = products?.Items?.map?.(
      (
        {
          id,
          description,
          title,
          price,
          priority,
          power,
          placeId
        }
      ) =>
        (
          {
            id: id?.S,
            description: description?.S,
            title: title?.S,
            power: Number(power?.N),
            price: Number(price?.N),
            placeId: placeId?.S,
            priority: Number(priority?.N),
            count: Number(
              stocks?.Items?.find(({product_id}) => product_id?.S === id?.S)?.count?.N ?? 0
            )
          }
        )
    );

  } catch (e) {
    console.log('Error get items', e);
    response.statusCode = 500;
    response.error = e?.message;
  }
  response.body = JSON.stringify(data);
  return response;
};
