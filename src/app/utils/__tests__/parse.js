import { getURLParameter } from '../parse';

const someParameter = 'parameter';
const url = 'http://somehost.ru';
describe('PARSE UTILS', () => {
    it('Должен декодировать и вернуть значение get параметра', () => {
        const value = 'test';
        expect(getURLParameter(someParameter, `${url}?${someParameter}=${value}`)).toBe(value);
    });

    it('Должен вернуть пустую строку если get параметр существует, а значение не указано', () => {
        expect(getURLParameter(someParameter, `${url}?${someParameter}`)).toBe('');
    });

    it('Должен вернуть значение get параметра - null', () => {
        expect(getURLParameter(someParameter)).toBeNull();
        expect(getURLParameter(someParameter, url)).toBeNull();
    });
});