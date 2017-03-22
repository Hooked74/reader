import * as tocActions from '../toc';
import {
    OPEN_TOC, 
    CLOSE_TOC
} from '../../constants';

describe('TOC ACTIONS', () => {
    it('Должен создать action, который открывает TOC', () => {
        expect(tocActions.openTOC()).toEqual({
            type: OPEN_TOC
        });
    });

    it('Должен создать action, который закрывает TOC', () => {
        expect(tocActions.closeTOC()).toEqual({
            type: CLOSE_TOC
        });
    });
});