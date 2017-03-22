import React from 'react';
import { shallow, mount } from 'enzyme';
import Spread from '../Spread';
import { 
    MIN_WIDTH_FOR_TWO_PAGES, 
    BOOK_STATUS_SUCCESS 
} from '../../constants';

function setup(book = {}, bookItems = {}, isMount = false) {
    const props = {
        book, 
        bookItems,
        resetPages: jest.fn()
    };
    const createWrapper = isMount ? mount : shallow;
    const enzymeWrapper = createWrapper(<Spread {...props} />);
    return { props, enzymeWrapper };
}

describe('SPREAD COMPONENT', () => {
    it('Должен отрисовать себя и дочерние компоненты', () => {
        const { enzymeWrapper } = setup(undefined, {pages: [], active: {}});
        expect(enzymeWrapper.is('#spread')).toBe(true);
        enzymeWrapper.children().forEach(node => {
            expect(node.hasClass('page')).toBe(true);
        });
    });

    it('Должен отобразить необходимое количество страниц в развороте', () => {
        const { enzymeWrapper } = setup(undefined, {pages: [], active: {}}, true);
        window.innerWidth = 1023;
        enzymeWrapper.update();
        expect(enzymeWrapper.node.isSinglePage).toBe(true);
        expect(enzymeWrapper.children('.page').length).toBe(1);

        window.innerWidth = 1024;
        enzymeWrapper.update();
        expect(enzymeWrapper.node.isSinglePage).toBe(false);

        expect(enzymeWrapper.children('.page').length).toBe(2);
        expect(enzymeWrapper.children('.page.page-left').length).toBe(1);
        expect(enzymeWrapper.children('.page.page-right').length).toBe(1);
    });

    it('Должен подписываться и удалять resize', () => {
        let resize = false;
        const addEventListener = ::window.addEventListener;
        const removeEventListener = ::window.removeEventListener;

        window.addEventListener = (...arg) => {
            resize = true;    
            addEventListener(...arg);
        };

        window.removeEventListener = (...arg) => {
            resize = false;    
            removeEventListener(...arg);
        };

        const { enzymeWrapper } = setup(undefined, {pages: [], active: {}}, true);
        expect(resize).toBe(true);
        enzymeWrapper.unmount();
        expect(resize).toBe(false);
    });

    it('Должен обрабатывать изменение размеров окна', () => {
        jest.useFakeTimers();
        const { enzymeWrapper, props } = setup(undefined, {pages: [], active: {}}, true);
        enzymeWrapper.node.forceUpdate = jest.fn();
        enzymeWrapper.node.handleResizeWindow();  
        enzymeWrapper.node.handleResizeWindow();  
        enzymeWrapper.node.handleResizeWindow();
        jest.runTimersToTime(enzymeWrapper.node.__delay);
        expect(enzymeWrapper.node.forceUpdate.mock.calls.length).toBe(1);
        expect(props.resetPages.mock.calls.length).toBe(0);

        const innerHeight = window.innerHeight;
        const innerWidth = window.innerWidth;

        window.innerHeight = -1;
        expect(enzymeWrapper.node.__windowHeight).not.toBe(window.innerHeight);
        enzymeWrapper.node.handleResizeWindow();
        jest.runTimersToTime(enzymeWrapper.node.__delay);
        expect(props.resetPages.mock.calls.length).toBe(1);
        expect(enzymeWrapper.node.__windowHeight).toBe(window.innerHeight);

        window.innerWidth = -1;
        expect(enzymeWrapper.node.__windowWidth).not.toBe(window.innerWidth);
        enzymeWrapper.node.handleResizeWindow();
        jest.runTimersToTime(enzymeWrapper.node.__delay);
        expect(props.resetPages.mock.calls.length).toBe(2);
        expect(enzymeWrapper.node.__windowWidth).toBe(window.innerWidth);

        window.innerHeight = innerHeight;
        window.innerWidth = innerWidth;
        jest.useRealTimers();
    });

    it('Должен вставлять необходимый контент в блоки страниц', () => {
        const innerWidth = window.innerWidth;
        window.innerHeight = MIN_WIDTH_FOR_TWO_PAGES;

        const pages = [[0, 1], [2]];
        const active = {bookItemIndex: 0, pageIndex: 0};
        const { enzymeWrapper } = setup(undefined, {pages, active}, true);
        expect(enzymeWrapper.find('.page-left').text()).toBe(pages[active.bookItemIndex][active.pageIndex].toString());
        expect(enzymeWrapper.find('.page-right').text()).toBe(pages[active.bookItemIndex][active.pageIndex + 1].toString());

        pages[0].pop();
        enzymeWrapper.setProps({bookItems: {pages, active}});
        expect(enzymeWrapper.find('.page-left').text()).toBe(pages[active.bookItemIndex][active.pageIndex].toString());
        expect(enzymeWrapper.find('.page-right').text()).toBe(pages[active.bookItemIndex + 1][0].toString());

        window.innerWidth = innerWidth;
    });

    it('Должен запускать калькуляцию страниц', () => {
        const { enzymeWrapper, props } = setup(undefined, {pages: [], active: {}}, true);
        enzymeWrapper.node.calculatePages = jest.fn();

        const book = { status: BOOK_STATUS_SUCCESS }
        const newProps = {
            ...props,
            book
        };
        enzymeWrapper.setProps({ book });
        expect(enzymeWrapper.node.calculatePages.mock.calls.length).toBe(1);
        expect(enzymeWrapper.node.calculatePages.mock.calls[0][0]).toEqual(newProps);
    });
});