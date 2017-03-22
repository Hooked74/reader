import { tocIsOpen } from '../toc';
import {
    OPEN_TOC, 
    CLOSE_TOC
} from '../../constants';

describe('TOC REDUCERS', () => {
    it('Должен вернуть начальное состояние', () => {
        expect(tocIsOpen(undefined, {})).toBeFalsy();
    });

    it('Должен обработать OPEN_TOC', () => {
        expect(tocIsOpen(false, { type: OPEN_TOC })).toBeTruthy();
    });

    it('Должен обработать CLOSE_TOC', () => {
        expect(tocIsOpen(false, { type: CLOSE_TOC })).toBeFalsy();
    });
});