import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { promises } from '../middlewares';
import * as reducers from '../reducers';

const reducer = combineReducers(reducers);
const configureStore = preloadedState => {
    const store = createStore(
        reducer,
        preloadedState,
        applyMiddleware(thunk, promises)
    );

    return store;
};

export default configureStore;