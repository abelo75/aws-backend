import {getAll} from "../data/mock";

export const getProductsList = async () => {
    const result = {
    }
    try {
        const list = await getAll();
        result.statusCode = 200;
        result.body = list ;
    } catch (e) {
        result.body = { error: e };
        result.statusCode = 500;
    }
    result.body = JSON.stringify(result.body);
    return result;
}
