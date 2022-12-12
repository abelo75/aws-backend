import {ddbClient, PRODUCTS_TABLE, uuidv4} from "./ddbClient.js";
import {PutItemCommand} from "@aws-sdk/client-dynamodb";

export const createProduct = async (event) => {

  const result = {
    id: {S: uuidv4() },
    description: { S: ''},
    title: { S: '' },
    price: { N: '0' },
    placeId: { S: '' },
    power: { N: '0' },
    priority: { N: '0' },
  };

  const response = {
    statusCode: 400,
    error: null,
    body: JSON.stringify(result),
  }

  let data;

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    body = {};
  }


  try {
    console.log('Event', JSON.stringify(event));
    const checkField = (name, type = 'S') => {
      const errorText = `{error: "Field ${name} is type ${typeof body[name]} but should be ${type === 'S' ? 'string' : 'number'}, value ${body[name]}"}`;
      result[name] = { S: body[name] };
      if (type === 'S') {
        if (typeof body[name] === 'undefined') {
          response.body = errorText;
          response.error = errorText;
          return false;
        }
        return true;
      }
      result[name] = { N: String(body[name]) };
      if (Number.isNaN(Number(body[name]))) {
        response.body = errorText;
        response.error = errorText;
        return false;
      }
      return true;
    }

    if (body?.id) {
      result.id = { S: body?.id };
    }

    if (!checkField('description')) {
      return response;
    }
    if (!checkField('title')) {
      return response;
    }
    if (!checkField('placeId')) {
      return response;
    }
    if (!checkField('priority', 'N')) {
      return response;
    }
    if (!checkField('power', 'N')) {
      return response;
    }
    if (!checkField('price', 'N')) {
      return response;
    }
    if (response.error) {
      return response;
    }

    const params = {
      TableName: PRODUCTS_TABLE,
      Item: result
    }

    data = {
      id: result.id.S,
      title: result.title.S,
      description: result.description.S,
      priority: result.price.N,
      price: result.price.N,
      power: result.power.N,
    }

    await ddbClient.send(new PutItemCommand(params));

    response.statusCode = 200;
  } catch (e) {
    console.error('Error', JSON.stringify(e?.message));
    response.statusCode = 500;
    response.error = JSON.stringify(e?.message);
  }

  response.body = JSON.stringify(data ?? {});

  return response;
}
