import { 
    OPEN_TOC, 
    CLOSE_TOC
} from '../constants';

const tocIsOpenInitialState = false;
export const tocIsOpen = (state = tocIsOpenInitialState, action) => {
    switch (action.type) {
    case OPEN_TOC:
        return true;
    case CLOSE_TOC:
        return false;
    default:
        return state;
    }
};