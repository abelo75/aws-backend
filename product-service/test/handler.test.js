import {data, getAll, getById} from "../data/mock";
import {getProductsById, getProductsList} from "../handler";

describe('Test products service functions', () => {
    test('Get all products', async () => {
        expect(await getAll()).toMatchObject(data);
    });

    test('Get products by id', async () => {
        expect(await getById('0001')).toMatchObject(data[0]);
        expect(await getById('0003')).toMatchObject(data[2]);
    });
});

describe('Test lambda handlers', () => {
    test('Get all products', async () => {
        expect(await getProductsList()).toMatchObject({statusCode: 200, body: JSON.stringify(data)});
    });
    test('Get products by id', async () => {
        expect(await getProductsById({
            pathParameters:
                {
                    productId: '0001'
                }
        })).toMatchObject({
            statusCode: 200,
            body: JSON.stringify(data[0])
        });
        expect(await getProductsById({
            pathParameters:
                {
                    productId: '011'
                }
        })).toMatchObject({
            statusCode: 404,
            message: 'Product not found',
        });
        const res = await getProductsById({
            pathParameters1: { q: 1 },
        });
        expect(res.statusCode).toEqual(500);
        expect(res.message).toEqual(expect.stringContaining("Cannot destructure property 'productId' of"));
    });
});
