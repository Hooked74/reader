import { 
    START_LOADING, 
    STOP_LOADING
} from '../constants';

const loadingInitialState = { visible: false, message: '' };
export const loading = (state = loadingInitialState, action) => {
    switch (action.type) {
    case START_LOADING:
        return { visible: true, message: action.payload };
    case STOP_LOADING:
        return { visible: false, message: '' };
    default:
        return state;
    }
};