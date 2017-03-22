import { sync } from '../utils';
import { BOOK_ID_KEY } from '../constants';
import config from '../config';

export function getBook() {
    return sync(`${API_URL}/books/${config[BOOK_ID_KEY]}/epub/content`).then(r => r.json());
}

export function getLastPosition() {
    // TODO: добавить синхронизацию
    return Promise.resolve({
        bookItemIndex: 4,
        paragraphIndex: 'paragraph-2',
        textOffset: 0
    });
}