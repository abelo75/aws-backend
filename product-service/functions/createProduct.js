import {dbClient, PRODUCTS_TABLE, uuidv4} from "./clients.js";
import {PutItemCommand} from "@aws-sdk/client-dynamodb";

export const createProductInDb = async (product) => {
  try {
    const result = {
      TableName: PRODUCTS_TABLE, Item: {
        id: {S: product?.id ?? uuidv4()},
        description: {S: product.description},
        title: {S: product.title},
        price: {N: String(product.price ?? 0)},
        placeId: {S: product.placeId},
        power: {N: String(product.power ?? '0')},
        priority: {N: String(product.priority ?? '0')},
      }
    };
    await dbClient.send(new PutItemCommand(result));
    return result;
  } catch (e) {
    console.warn('Error create database record', e?.message ?? JSON.stringify(e));
  }
}
export const createProduct = async (event) => {


  const response = {
    statusCode: 400, error: null, body: '',
  }

  let data;

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    body = {};
  }

  const result = {};


  try {
    console.log('Event', JSON.stringify(event));
    const checkField = (name, type = 'S') => {
      const errorText = `{error: "Field ${name} is type ${typeof body[name]} but should be ${type === 'S' ? 'string' : 'number'}, value ${body[name]}"}`;
      result[name] = body[name];
      if (type === 'S') {
        if (typeof body[name] === 'undefined') {
          response.body = errorText;
          response.error = errorText;
          return false;
        }
        return true;
      }
      if (Number.isNaN(Number(body[name]))) {
        response.body = errorText;
        response.error = errorText;
        return false;
      }
      return true;
    }

    if (body?.id) {
      result.id = body.id;
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
    await createProductInDb(result);
    response.statusCode = 200;
  } catch (e) {
    console.error('Error', JSON.stringify(e?.message));
    response.statusCode = 500;
    response.error = JSON.stringify(e?.message);
  }

  response.body = JSON.stringify(data ?? {});

  return response;
}
