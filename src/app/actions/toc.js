import {
    OPEN_TOC, 
    CLOSE_TOC
} from '../constants';

export const openTOC = () => ({
    type: OPEN_TOC
});

export const closeTOC = () => ({
    type: CLOSE_TOC
});