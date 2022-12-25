import {catalogBatchProcess} from "../handler";
import {data} from "../data/mock";

jest.mock('../functions/createProduct.js', () => {
  return {
    createProductInDb: (data) => {
      // console.log('Mock create product in db', data);
      const {id, placeId, description, price, power, priority} = data;
      return Promise.resolve({
        id: {S: id},
        description: {S: description},
        title: {S: description},
        placeId: {S: placeId},
        price: {N: price},
        power: {N: power},
        priority: {N: priority},
      });
    }
  }
});
jest.mock('@aws-sdk/client-sns', () => {
  return {
    SNSClient: jest.fn().mockImplementation((param) => {
      return {
        send: (command) => {
          return {command, param};
        },
      }
    }), PublishCommand: jest.fn().mockImplementation((param) => {
      return {param};
    }),
  }
});
describe('Test create batchProcess', () => {
  const eventOk = {
    Records: [{
      body: JSON.stringify(data),
    },]
  };
  const eventSingle = {
    Records: [{
      body: JSON.stringify(data[0]),
    },]
  }
  test('createBatchProcess OK', async () => {
    const res = await catalogBatchProcess(eventOk);
    expect(res.statusCode).toEqual(200);
    console.log('Res', res);
  });
  test('createBatchProcess single', async () => {
    const res = await catalogBatchProcess(eventSingle);
    expect(res.statusCode).toEqual(200);
    console.log('Res', res);
  });
  test('createBatchProcess empty body', async () => {
    const res = await catalogBatchProcess();
    expect(res.statusCode).toEqual(500);
    console.log('Res', res);
  });
  test('createBatchProcess empty records', async () => {
    const res = await catalogBatchProcess({Records: {body: data[0]}});
    expect(res.statusCode).toEqual(500);
    console.log('Res', res);
  });
});
