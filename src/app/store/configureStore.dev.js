import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import DevTools from '../containers/DevTools';
import { promises } from '../middlewares';
import * as reducers from '../reducers';

const reducer = combineReducers(reducers);
const configureStore = preloadedState => {
    const store = createStore(
        reducer,
        preloadedState,
        compose(
            applyMiddleware(thunk, promises, createLogger()),
            DevTools.instrument()
        )
    );

    return store;
};

export default configureStore;