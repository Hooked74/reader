import {
    PROMISE,
    START_LOADING_BOOK,
    SUCCESS_LOADING_BOOK,
    FAILURE_LOADING_BOOK,
    RESET_PAGES,
    CHANGE_ACTIVE_PAGE,
    LOAD_BOOK_TEXT,
    START_LOADING_LAST_POSITION,
    SUCCESS_LOADING_LAST_POSITION,
    FAILURE_LOADING_LAST_POSITION
} from '../constants';
import { getBook, getLastPosition } from '../api';
import { startLoading } from './loading';
import { closeTOC } from './toc';

function validateConvertedBookIndexes(bookItems, bookItemIndex, pageIndex) {
    const pages = bookItems.pages;
    const active = bookItems.active;
    return pages[bookItemIndex] 
        && pages[bookItemIndex][pageIndex]
        && active.bookItemIndex !== bookItemIndex
        && active.pageIndex !== pageIndex;
}

function getPageIndex(bookItems, bookItemIndex, paragraphIndex, textOffset) {
    //TODO: еще добавить validateBookIndexes
}

export const loadBook = () => ({
    type: PROMISE,
    promiseTypes: [START_LOADING_BOOK, SUCCESS_LOADING_BOOK, FAILURE_LOADING_BOOK],
    promise: getBook()    
});

export const loadLastPosition = () => ({
    type: PROMISE,
    promiseTypes: [START_LOADING_LAST_POSITION, SUCCESS_LOADING_LAST_POSITION, FAILURE_LOADING_LAST_POSITION],
    promise: getLastPosition()
});

export const load = () => dispatch => {
    const dispatchLoadBook = () => dispatch(loadBook());
    return Promise.all([
        dispatch(startLoading(LOAD_BOOK_TEXT)),
        dispatch(loadLastPosition())
    ]).then(dispatchLoadBook, dispatchLoadBook);
};

export const goToBookItem = index => (dispatch, getStore) => {
    if (Number.isFinite(index)
        && validateConvertedBookIndexes(getStore().bookItems, index, 0)) {
        return dispatch({
            type: CHANGE_ACTIVE_PAGE,
            payload: { bookItemIndex: index, pageIndex: 0 }
        });
    }
};

// export const appendPageCount = (index, count) => {
//     count = parseInt(count);
//     if (Number.isFinite(index) && count > 0) {
//         return {
//             type: APPEND_PAGE_COUNT,
//             payload: { index, count }
//         };
//     }
// };

export const resetPages = () => dispatch => {
    return Promise.all([
        dispatch(closeTOC()),
        dispatch({ type: RESET_PAGES })
    ]);
};