import * as loadingActions from '../loading';
import {
    START_LOADING, 
    STOP_LOADING
} from '../../constants';

describe('LOADING ACTIONS', () => {
    it('Должен создать action, который начинает загрузку', () => {
        const message = 'test message';
        expect(loadingActions.startLoading(message)).toEqual({
            type: START_LOADING,
            payload: message
        });
    });

    it('Должен создать action, который останавливает загрузку', () => {
        expect(loadingActions.stopLoading()).toEqual({
            type: STOP_LOADING
        });
    });
});