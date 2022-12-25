import {createProductInDb} from "../functions/createProduct";
import {getProductsList} from "../functions/getProductsList";
import {data, stockData} from "../data/mock";
import {getProductsById} from "../handler";

const expectedDoc = {
  Item: {
    id: {S: "1"},
    title: {S: "Test title"},
    description: {S: "Test description"},
    price: {N: "102"},
    power: {N: "104"},
    placeId: {S: "1022"},
    priority: {N: "1122"},
  },
};

jest.mock('@aws-sdk/client-dynamodb', () => {
  return {
    DynamoDBClient: jest.fn().mockImplementation((clientParam, c1) => {
      return {
        send: (command) => {
          const answer = {
            PutItemCommand: expectedDoc
          }
          return answer[command?.name];
        },
      };
    }),
    PutItemCommand: jest.fn().mockImplementation((params) => {
      return {name: 'PutItemCommand', params};
    }),
    ScanCommand: jest.fn().mockImplementation((params) => {
      return {name: 'ScanCommand', params};
    }),
    QueryCommand: jest.fn().mockImplementation((params) => {
      return {name: 'QueryCommand', params};
    }),
  };
});
jest.mock('@aws-sdk/lib-dynamodb', () => {
  return {
    DynamoDBDocumentClient: {
      from: jest.fn().mockImplementation(() => {
        return {
          send: jest.fn().mockImplementation((command) => {
            const products = [
              {
                id: '0001',
                description: 'Bundle 100 kW',
                placeId: '0002',
                power: 100,
                price: 120,
                priority: 0,
              },
              {
                id: '0002',
                description: 'Bundle 50 kW',
                placeId: '0002',
                power: 50,
                price: 65,
                priority: 0,
              },
              {
                id: '0003',
                description: 'Bundle 100 kW',
                placeId: '0001',
                power: 100,
                price: 110,
                priority: 0,
              },
              {
                id: '0004',
                description: 'Bundle 100 kW Priority',
                placeId: '0001',
                power: 100,
                price: 140,
                priority: 1,
              },
              {
                id: '0005',
                description: 'Bundle 100 kW Luxury',
                placeId: '0001',
                power: 100,
                price: 150,
                priority: 2,
              },
              {
                id: '0006',
                description: 'Bundle 50 kW Priority',
                placeId: '0001',
                power: 50,
                price: 70,
                priority: 0,
              },
              {
                id: '0007',
                description: 'Bundle 50 kW Luxury',
                placeId: '0001',
                power: 50,
                price: 90,
                priority: 0,
              },
              {
                id: '0008',
                description: 'Bundle 200 kW',
                placeId: '0002',
                power: 200,
                price: 220,
                priority: 0,
              },
            ];
            const stocks = [
              {
                id: '0001',
                count: 10,
              },
              {
                id: '0002',
                count: 11,
              },
              {
                id: '0003',
                count: 12,
              },
              {
                id: '0004',
                count: 13,
              },
              {
                id: '0005',
                count: 14,
              },
              {
                id: '0006',
                count: 15,
              },
              {
                id: '0007',
                count: 11,
              },
              {
                id: '0008',
                count: 17,
              },
            ];
            const commandName = command.name;
            const commandParams = command.params;
            const filterId = commandParams?.ExpressionAttributeValues?.[':s']?.S;
            const filterProductId = commandParams?.ExpressionAttributeValues?.[':s']?.S;
            const answer = {
              ScanCommand: {
                products: {
                  Items: products.map(({id, description, power, placeId, price, priority}) => ({
                    id: {S: id},
                    description: {S: description},
                    title: {S: description},
                    power: {N: power},
                    price: {N: price},
                    placeId: {S: placeId},
                    priority: {N: priority}
                  }))
                },
                stocks: {Items: stocks.map(({id, count}) => ({product_id: {S: id}, count: {N: count}}))},
              },
              QueryCommand: {
                products: {
                  Items: products.filter(({id}) => filterId === id).map(({
                                                                           id,
                                                                           description,
                                                                           power,
                                                                           placeId,
                                                                           price,
                                                                           priority
                                                                         }) => ({
                    id: {S: id},
                    description: {S: description},
                    title: {S: description},
                    power: {N: power},
                    price: {N: price},
                    placeId: {S: placeId},
                    priority: {N: priority}
                  }))
                },
                stocks: {
                  Items: stocks.filter(({id}) => id === filterProductId).map(({
                                                                                id,
                                                                                count
                                                                              }) => ({
                    product_id: {S: id},
                    count: {N: count}
                  }))
                },
              }
            }
            const res = answer?.[command?.name]?.[command?.params?.TableName];
            return Promise.resolve(res);
          }),
        };
      }),
    },
    GetCommand: jest.fn().mockImplementation((params, p1) => {
      return {name: 'GetCommand', params, p1};
    }),
  };
});

describe('test database operations', () => {
  const allData = data.map(product => ({
    ...product,
    title: product.description,
    count: stockData.find(({id}) => id === product.id)?.count ?? 0
  }));
  test('createProductInDb', async () => {
    const doc = {
      id: "1",
      title: "Test title",
      description: "Test description",
      price: 102,
      power: 104,
      placeId: "1022",
      priority: 1122,
    };

    const res = await createProductInDb(doc);
    expect(res).toMatchObject(expectedDoc);
  });
  test('getAllProducts', async () => {
    const res = await getProductsList();
    expect(res.statusCode).toEqual(200);
    expect(res.error).toBeNull();
    expect(JSON.parse(res.body))
      .toMatchObject(
        data.map(product => ({
          ...product,
          title: product.description,
          count: stockData.find(({id}) => id === product.id)?.count ?? 0
        })));
  });
  test('getProductsById 0001', async () => {
    const res = await getProductsById({
      pathParameters:
        {
          productId: '0001'
        }
    });
    expect(res.statusCode).toEqual(200);
    expect(res.error).toBeNull();
    expect(JSON.parse(res.body))
      .toMatchObject(allData[0]);
  });
  test('getProductsById 0008', async () => {
    const res = await getProductsById({
      pathParameters:
        {
          productId: '0008'
        }
    });
    expect(res.statusCode).toEqual(200);
    expect(res.error).toBeNull();
    expect(JSON.parse(res.body))
      .toMatchObject(allData.find(({id}) => id === '0008'));
  });
});
