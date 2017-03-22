import { 
    START_LOADING_BOOK, 
    SUCCESS_LOADING_BOOK, 
    FAILURE_LOADING_BOOK,
    BOOK_STATUS_LOADING,
    BOOK_STATUS_SUCCESS,
    BOOK_STATUS_ERROR,
    APPEND_ITEM_PAGES,
    RESET_PAGES,
    CHANGE_ACTIVE_PAGE,
    ADD_LAST_POSITION,
    RESET_LAST_POSITION,
    SUCCESS_LOADING_LAST_POSITION
} from '../constants';

const bookInitialState = {};
export const book = (state = bookInitialState, action) => {
    switch (action.type) {
    case START_LOADING_BOOK:
        return { status: BOOK_STATUS_LOADING };
    case SUCCESS_LOADING_BOOK:
        return { status: BOOK_STATUS_SUCCESS, data: action.payload };
    case FAILURE_LOADING_BOOK:
        return { status: BOOK_STATUS_ERROR, error: action.error };
    default:
        return state;
    }
};

const bookItemsInitialState = {
    pages: [],
    active: {
        bookItemIndex: 0,
        pageIndex: 0
    },
    pageCountCollection: [],
    lastPosition: null
};
export const bookItems = (state = bookItemsInitialState, action) => {
    switch (action.type) {
    case CHANGE_ACTIVE_PAGE:
        return {
            ...state,
            active: {
                ...state.active,
                bookItemIndex: action.payload.bookItemIndex,
                pageIndex: action.payload.pageIndex
            }
        };
    case APPEND_ITEM_PAGES:
        const pages = state.pages.slice();
        const pageCountCollection = state.pageCountCollection.slice();
        pages[action.payload.index] = action.payload.pages;
        pageCountCollection[action.payload.index] = action.payload.pages.length;
        return {
            ...state,
            pages,
            pageCountCollection
        };
    case RESET_PAGES:
        return {
            ...state,
            active: {
                ...state.active,
                pageIndex: 0
            },
            pageCountCollection: [],
            pages: []
        };
    case SUCCESS_LOADING_LAST_POSITION:
    case ADD_LAST_POSITION:
        return {
            ...state,
            loadedPosition: action.payload
        };
    case RESET_LAST_POSITION:
        return {
            ...state,
            loadedPosition: null
        };
    default:
        return state;
    }
};