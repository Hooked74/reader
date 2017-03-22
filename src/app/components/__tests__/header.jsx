import React from 'react';
import { shallow } from 'enzyme';
import Header from '../Header';

function setup(book, tocIsOpen) {
    const props = {
        openTOC: jest.fn(),
        closeTOC: jest.fn(),
        book, 
        tocIsOpen
    };
    const enzymeWrapper = shallow(<Header {...props} />);
    return { props, enzymeWrapper };
}

function getData(title, author) {
    return {
        package: {
            metadata: {
                title: [{
                    value: title
                }],
                creator: [{
                    value: author    
                }]
            }
        }
    };
}

describe('HEADER COMPONENT', () => {
    it('Должен отрисовать себя и дочерние компоненты', () => {
        const { enzymeWrapper } = setup({}, false);
        expect(enzymeWrapper.is('#header')).toBe(true);

        const left = enzymeWrapper.children('.header-left');
        const center = enzymeWrapper.children('.header-center');
        const right = enzymeWrapper.children('.header-right');
        expect(left.length).toBe(1);
        expect(center.length).toBe(1);
        expect(right.length).toBe(1);
    });

    it('Должен вернуть заголовок и автора', () => {
        let { enzymeWrapper } = setup({}, false);
        let headerCenter = enzymeWrapper.find('.header-center-wrapper');
        expect(headerCenter.children('h1').text()).toBe('Название книги');
        expect(headerCenter.children('h2').text()).toBe('Автор');

        enzymeWrapper = setup({
            data: getData(' Тест названия ', '   Тест автора   ')
        }, false).enzymeWrapper;
        headerCenter = enzymeWrapper.find('.header-center-wrapper');
        expect(headerCenter.children('h1').text()).toBe('Тест названия');
        expect(headerCenter.children('h2').text()).toBe('Тест автора');

        enzymeWrapper = setup({
            data: getData('  ', '  ')
        }, false).enzymeWrapper;
        headerCenter = enzymeWrapper.find('.header-center-wrapper');
        expect(headerCenter.children('h1').text()).toBe('Название книги');
        expect(headerCenter.children('h2').text()).toBe('Автор');
    });

    it('Должен переходить на портал', () => {
        const { enzymeWrapper } = setup({}, false);
        const replace = location.replace;
        const mockReplace = jest.fn();
        location.replace = function() { 
            mockReplace(...arguments); 
        };

        enzymeWrapper.find('.logo').simulate('click');
        expect(mockReplace.mock.calls.length).toBe(1);
        expect(mockReplace.mock.calls[0][0]).toBe(PORTAL_URL);
        location.replace = location::replace;
    });

    it('Должен открывать и закрывать TOC', () => {
        const { enzymeWrapper, props } = setup({}, false);
        let hamburger = enzymeWrapper.find('#tocOpener');

        expect(hamburger.hasClass('fa-bars')).toBeTruthy();
        hamburger.simulate('click');
        expect(props.openTOC.mock.calls.length).toBe(1);
        expect(props.closeTOC.mock.calls.length).toBe(0);

        enzymeWrapper.setProps({tocIsOpen: true});
        hamburger = enzymeWrapper.find('#tocOpener');

        expect(hamburger.hasClass('fa-arrow-left')).toBeTruthy();
        hamburger.simulate('click');
        expect(props.openTOC.mock.calls.length).toBe(1);
        expect(props.closeTOC.mock.calls.length).toBe(1);
    });
});