import {groupBy, splitByPlace} from "../functions/catalogBatchProcess";
import {data} from "../data/mock";
import {uuidv4} from "../functions/clients";

describe('Utils test', () => {
  test('groupBy', () => {
    const res = splitByPlace(data);
    expect(res).toMatchObject({
      '0001': data.filter(({placeId}) => placeId === '0001'), '0002': data.filter(({placeId}) => placeId === '0002')
    });
  });
  test('uuid', () => {
    const id = uuidv4();
    expect(id.length).toEqual(36);
    const idDigits = id.split('-').join('');
    expect(idDigits.length).toEqual(32);
    const digits = '0123456789abcdef';
    expect(idDigits.split('').every(char => digits.includes(char))).toBeTruthy();
  });
});
