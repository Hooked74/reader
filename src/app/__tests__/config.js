import config from '../config';
import { BOOK_ID_KEY, TEST_BOOK_ID } from '../constants';
import { getURLParameter } from '../utils';

describe('CONFIG', () => {
    it('Должен проверить id книги', () => {
        expect(config[BOOK_ID_KEY]).toBe(TEST_BOOK_ID);

        const bookIDGetParameter = getURLParameter(BOOK_ID_KEY);
        if (bookIDGetParameter) {
            expect(config[BOOK_ID_KEY] === bookIDGetParameter).toBeTruthy();
        } else {
            expect(config[BOOK_ID_KEY] === bookIDGetParameter).toBeFalsy();    
        }
    });
});