import { loading } from '../loading';
import {
    START_LOADING, 
    STOP_LOADING
} from '../../constants';

describe('LOADING REDUCERS', () => {
    const loaderInitialState = { visible: false, message: '' };
    it('Должен вернуть начальное состояние', () => {
        expect(loading(undefined, {})).toEqual(loaderInitialState);
    });

    it('Должен обработать START_LOADING', () => {
        const message = 'message';
        expect(loading(false, { 
            type: START_LOADING,
            payload: message
        })).toEqual({ visible: true, message });
    });

    it('Должен обработать STOP_LOADING', () => {
        expect(loading(false, { type: STOP_LOADING })).toEqual(loaderInitialState);
    });
});