import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import config from '../../config';
import { promises } from '../../middlewares';
import {
    START_LOADING,
    START_LOADING_BOOK,
    SUCCESS_LOADING_BOOK,
    RESET_PAGES,
    CHANGE_ACTIVE_PAGE,
    BOOK_ID_KEY,
    LOAD_BOOK_TEXT
} from '../../constants';
import * as bookActions from '../book';

const middlewares = [thunk, promises];
const mockStore = configureMockStore(middlewares);

describe('BOOK ACTIONS', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it('Должен создать action, который получает информацию о книге', () => {
        const bookInfo = { content: true };
        nock(API_URL)
            .get(`/books/${config[BOOK_ID_KEY]}/epub/content`)
            .reply(200, bookInfo);

        const expectedActions = [ 
            { type: START_LOADING, payload: LOAD_BOOK_TEXT },
            { type: START_LOADING_BOOK },
            { type: SUCCESS_LOADING_BOOK, payload: bookInfo }
        ];
        const store = mockStore({ book: null });
        return store.dispatch(bookActions.loadBook())
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('Должен создать action, который отправляет к началу главы', () => {
        const pages = [['page1', 'page2'], ['page1', 'page2']];
        let store = mockStore({ 
            bookItems: { pages, active: { bookItemIndex: null, pageIndex: null } } 
        });

        const index = 1;
        expect(store.dispatch(bookActions.goToBookItem(index))).toEqual({
            type: CHANGE_ACTIVE_PAGE,
            payload: { bookItemIndex: index, pageIndex: 0 }
        });

        store = mockStore({ 
            bookItems: { pages, active: { bookItemIndex: 1, pageIndex: 0 } } 
        });
        expect(store.dispatch(bookActions.goToBookItem(index))).toBeUndefined();
        expect(store.dispatch(bookActions.goToBookItem(pages.length))).toBeUndefined();
        expect(store.dispatch(bookActions.goToBookItem())).toBeUndefined();
        expect(store.dispatch(bookActions.goToBookItem(null))).toBeUndefined();
        expect(store.dispatch(bookActions.goToBookItem("1"))).toBeUndefined();
    });

    // it('Должен создать action, который добавляет количество страниц в массив страниц', () => {
    //     expect(bookActions.appendPageCount()).toBeUndefined();
    //     expect(bookActions.appendPageCount("1")).toBeUndefined();
    //     expect(bookActions.appendPageCount("1", -1)).toBeUndefined();
    //     expect(bookActions.appendPageCount(1, null)).toBeUndefined();
    //     expect(bookActions.appendPageCount(null, 1)).toBeUndefined();

    //     const index = 1;
    //     const count = 2;
    //     expect(bookActions.appendPageCount(index, count)).toEqual({
    //         type: APPEND_PAGE_COUNT,
    //         payload: {index, count}
    //     });
    // });

    it('Должен создать action, который удаляет все страницы и сбрасивыет активную на 0', () => {
        expect(bookActions.resetPages()).toEqual({
            type: RESET_PAGES
        });
    });
});