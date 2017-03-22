import { BOOK_ID_KEY, TEST_BOOK_ID } from './constants';
import { getURLParameter } from './utils';

const config = Object.assign({
    [BOOK_ID_KEY]: TEST_BOOK_ID // ID книги для тестирования
}, window.config);

const bookIDGetParameter = getURLParameter(BOOK_ID_KEY);
if (bookIDGetParameter) config[BOOK_ID_KEY] = bookIDGetParameter;

export default config;