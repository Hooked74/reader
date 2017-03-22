import nock from 'nock';
import { sync } from '../sync';
import { BOOK_ID_KEY } from '../../constants';
import config from '../../config';

const url = `/books/${config[BOOK_ID_KEY]}/epub/content`;
describe('SYNC UTILS', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it('Должен вернуть resolve', () => {
        const response = { success: true };
        nock(API_URL)
            .get(url)
            .reply(200, response);

        return sync(API_URL + url)
            .then(r => r.json())
            .then(r => expect(r).toEqual(response));
    });

    it('Должен вернуть reject', () => {
        const error = 'something awful happened';
        nock(API_URL)
            .get(url)
            .reply(400);
            
        nock(API_URL)
            .get('/')
            .reply(400);

        return Promise.all([
            sync(API_URL + url, error).catch(e => expect(e.toString()).toContain(error)),
            sync(API_URL).catch(e => expect(e).toBeInstanceOf(Error))
        ]);
    });
});