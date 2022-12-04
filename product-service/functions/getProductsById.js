import {getById} from "../data/mock";

export const getProductsById = async (event) => {
    const result = {
        statusCode: 404,
        message: 'Product not found',
    }
    try {
        const { productId } = event.pathParameters;
        const product = await getById(productId);
        if (product) {
            result.statusCode = 200;
            result.body = product;
            result.message = '';
        }
    } catch (e) {
        result.body = { error: e };
        result.statusCode = 500;
        result.message = e.message;
    }
    result.body = JSON.stringify(result.body);
    return result;
}
