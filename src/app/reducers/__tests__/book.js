import * as reducers from '../book';
import {
    START_LOADING_BOOK, 
    SUCCESS_LOADING_BOOK, 
    FAILURE_LOADING_BOOK,
    BOOK_STATUS_LOADING,
    BOOK_STATUS_SUCCESS,
    BOOK_STATUS_ERROR,
    RESET_PAGES,
    CHANGE_ACTIVE_PAGE,
    APPEND_ITEM_PAGES
} from '../../constants';

describe('BOOK REDUCERS', () => {
    describe('BOOK REDUCER', () => {
        it('Должен вернуть начальное состояние', () => {
            expect(reducers.book(undefined, {})).toEqual({});
        });

        it('Должен обработать START_LOADING_BOOK', () => {
            expect(reducers.book(undefined, { type: START_LOADING_BOOK })).toEqual({ status: BOOK_STATUS_LOADING }); 
        });

        it('Должен обработать SUCCESS_LOADING_BOOK', () => {
            const data = { test: 'test' };
            expect(reducers.book(undefined, { 
                type: SUCCESS_LOADING_BOOK, 
                payload: data
            })).toEqual({ 
                status: BOOK_STATUS_SUCCESS,
                data
            });
        });

        it('Должен обработать FAILURE_LOADING_BOOK', () => {
            const error = new Error('test');
            expect(reducers.book(undefined, { 
                type: FAILURE_LOADING_BOOK, 
                error
            })).toEqual({ 
                status: BOOK_STATUS_ERROR,
                error
            }); 
        }); 
    });

    describe('BOOK ITEM REDUCER', () => {
        const bookItemInitialState = {
            pages: [],
            active: {
                bookItemIndex: 0,
                pageIndex: 0
            },
            pageCountCollection: []
        };
        it('Должен вернуть начальное состояние', () => {
            expect(reducers.bookItems(undefined, {})).toEqual(bookItemInitialState);
        });

        it('Должен обработать CHANGE_ACTIVE_PAGE', () => {
            const resultState = {
                ...bookItemInitialState,
                active: {
                    ...bookItemInitialState.active,
                    bookItemIndex: 0,
                    pageIndex: 1   
                }
            };
            
            expect(reducers.bookItems(undefined, { 
                type: CHANGE_ACTIVE_PAGE,
                payload: { bookItemIndex: 0, pageIndex: 1 }
            })).toEqual(resultState);


            expect(reducers.bookItems(bookItemInitialState, { 
                type: CHANGE_ACTIVE_PAGE,
                payload: { bookItemIndex: 0, pageIndex: 1 }
            })).toEqual(resultState);
        });

        it('Должен обработать RESET_PAGES', () => {
            const initialState = {
                ...bookItemInitialState,
                pages: [[0], [0]],
                active: {
                    ...bookItemInitialState.active,
                    bookItemIndex: 1,
                    pageIndex: 1   
                },
                pageCountCollection: [1, 2, 3]
            };

            const resultState = {
                ...bookItemInitialState,
                pages: [],
                active: {
                    ...bookItemInitialState.active,
                    bookItemIndex: 1,
                    pageIndex: 0   
                },
                pageCountCollection: []
            };

            expect(reducers.bookItems(initialState, { type: RESET_PAGES })).toEqual(resultState);
        });

        it('Должен обработать APPEND_ITEM_PAGES', () => {
            const index = 0;
            const itemPages = [0, 0];
            const resultState = {
                ...bookItemInitialState,
                pages: [itemPages],
                pageCountCollection: [itemPages.length]
            };

            const action = {
                type: APPEND_ITEM_PAGES,
                payload: {
                    index,
                    pages: itemPages
                }
            };

            expect(reducers.bookItems(bookItemInitialState, action)).toEqual(resultState);
        });    
    });
});