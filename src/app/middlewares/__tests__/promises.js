import configureMockStore from 'redux-mock-store';
import { promises } from '../promises';
import { PROMISE } from '../../constants';
const middlewares = [promises];
const mockStore = configureMockStore(middlewares);

const START_PROMISE = 'START_PROMISE';
const SUCCESS_PROMISE = 'SUCCESS_PROMISE';
const FAILURE_PROMISE = 'FAILURE_PROMISE';
const DO_SOMETHING = 'DO_SOMETHING';

describe('PROMISES MIDDLEWARE', () => {
    it('Должен пропустить выполнение в следующий middleware и вернуть action', () => {
        const store = mockStore({});
        const action = {
            type: DO_SOMETHING,
            promiseTypes: [START_PROMISE, SUCCESS_PROMISE, FAILURE_PROMISE],
            promise: Promise.resolve({ test: 'test' })
        };
        expect(store.dispatch(action)).toEqual(action);

        const actions = store.getActions();
        expect(actions.length).toBe(1);
        expect(actions[0]).toEqual(action);
    });

    it('Должен выполниться action success и вернуть результаты промиса', () => {
        const store = mockStore({});
        const data = { test: 'test' };
        const action = {
            type: PROMISE,
            promiseTypes: [START_PROMISE, SUCCESS_PROMISE, FAILURE_PROMISE],
            promise: Promise.resolve(data)
        };
        return store.dispatch(action).then(() => {
            const resultActions = [ 
                { type: START_PROMISE },
                { type: SUCCESS_PROMISE, payload: data } 
            ];
            expect(store.getActions()).toEqual(resultActions);
        });
    });

    it('Должен выполниться action failure и вернуть результаты промиса', () => {
        const store = mockStore({});
        const data = { test: 'test' };
        const action = {
            type: PROMISE,
            promiseTypes: [START_PROMISE, SUCCESS_PROMISE, FAILURE_PROMISE],
            promise: Promise.reject(data)
        };
        return store.dispatch(action).then(() => {
            const resultActions = [ 
                { type: START_PROMISE },
                { type: FAILURE_PROMISE, error: data } 
            ];
            expect(store.getActions()).toEqual(resultActions);
        });      
    });
});