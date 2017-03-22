import {
    START_LOADING,
    STOP_LOADING
} from '../constants';

export const startLoading = message => ({
    type: START_LOADING,
    payload: message 
});

export const stopLoading = () => ({
    type: STOP_LOADING
});