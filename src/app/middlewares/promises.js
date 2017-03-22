import { PROMISE } from '../constants';

export const promises = store => next => action => {
    if (action.type !== PROMISE) return next(action);

    const [startType, successType, failureType] = action.promiseTypes;

    store.dispatch({
        type: startType
    });

    return action.promise.then(data => store.dispatch({
        type: successType,
        payload: data  
    }), error => store.dispatch({
        type: failureType,
        error  
    }));
};