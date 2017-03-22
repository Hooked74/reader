import React from 'react';
import { shallow, mount } from 'enzyme';
import TocModal from '../TocModal';
import { BOOK_STATUS_SUCCESS, SPECIAL_PAGES_COUNT } from '../../constants';

function setup(book, pageCountCollection, tocIsOpen, isMount = false) {
    const props = {
        goToBookItem: jest.fn(),
        closeTOC: jest.fn(),
        pageCountCollection,
        book, 
        tocIsOpen
    };
    const createWrapper = isMount ? mount : shallow;
    const enzymeWrapper = createWrapper(<TocModal {...props} />);
    return { props, enzymeWrapper };
}

function getData() {
    return {
        get navPointItems() {
            return this.ncx.navMap.navPointItems;
        },
        ncx: {
            navMap: {
                navPointItems: [
                    {
                        navLabel: 'Обложка'
                    },
                    {
                        navLabel: 'Титульный лист'   
                    },
                    {
                        navLabel: 'Оглавление'    
                    },
                    {
                        navLabel: 'Глава 1' 
                    },
                    {
                        navLabel: 'Глава 2'    
                    },
                    {
                        navLabel: 'Глава 3'    
                    }
                ]
            }
        }
    };
}

function getPageCountCollection() {
    return [1, 1, 2, 3, 5, 4];
} 

describe('TOC MODAL COMPONENT', () => {
    it('Должен отрисовать себя и дочерние компоненты', () => {
        const { enzymeWrapper } = setup({}, [], false);
        expect(enzymeWrapper.is('#tocModalWrapper')).toBe(true);
        expect(enzymeWrapper.find('.modal.modal-left').length).toBe(1);
        expect(enzymeWrapper.find('.modal-header').length).toBe(1);
        expect(enzymeWrapper.find('.modal-body').length).toBe(1);
    });

    it('Должен изменять видимость overlay', () => {
        const { enzymeWrapper } = setup({}, [], false);
        expect(enzymeWrapper.find('.overlay').hasClass('hidden')).toBe(true);
        enzymeWrapper.setProps({ tocIsOpen: true });
        expect(enzymeWrapper.find('.overlay').hasClass('hidden')).toBe(false);
    });

    it('Должен закрывать TOC', () => {
        const { enzymeWrapper, props } = setup({}, [], true);
        enzymeWrapper.find('.overlay').simulate('click');
        expect(props.closeTOC.mock.calls.length).toBe(1);
    });

    it('Должен отобразить список глав без страниц и не кликабельный', () => {
        const { enzymeWrapper, props } = setup({
            status: BOOK_STATUS_SUCCESS,
            data: getData()
        }, [], true);
        
        const tocList = enzymeWrapper.find('.modal-body');
        expect(tocList.children().length).toBe(props.book.data.navPointItems.length - SPECIAL_PAGES_COUNT);
        tocList.children().forEach((node, i) => {
            const chapterIndex = i + SPECIAL_PAGES_COUNT;
            expect(node.hasClass('tocitem')).toBe(true);
            expect(node.hasClass('disabled')).toBe(true);
            expect(node.is(`[data-index=${chapterIndex}]`)).toBe(true);
            expect(node.children('.title').text()).toBe(props.book.data.navPointItems[chapterIndex].navLabel);
            expect(node
                    .children('.pagenumber')
                    .contains(<i className="fa fa-spinner fa-spin"></i>))
                .toBe(true);
        });
    });

    it('Должен отобразить список глав со страницами', () => {
        const { enzymeWrapper, props } = setup({
            status: BOOK_STATUS_SUCCESS,
            data: getData()
        }, getPageCountCollection(), true);
        
        const tocList = enzymeWrapper.find('.modal-body');
        let page = props.pageCountCollection.slice(0, SPECIAL_PAGES_COUNT).reduce((p, n) => p + n, 0);
        tocList.children().forEach((node, i) => {
            const chapterIndex = i + SPECIAL_PAGES_COUNT;
            expect(node.hasClass('disabled')).toBe(false);
            expect(node.is(`[data-index=${chapterIndex}]`)).toBe(true);
            expect(node.children('.title').text()).toBe(props.book.data.navPointItems[chapterIndex].navLabel);
            expect(node.children('.pagenumber').text()).toBe((page + 1).toString());
            page += props.pageCountCollection[chapterIndex];
        });
    });

    it('Должен закрыть модальное окно и перейти в начало главы по клику', () => {
        const { enzymeWrapper, props } = setup({
            status: BOOK_STATUS_SUCCESS,
            data: getData()
        }, getPageCountCollection(), true, true);
        
        const tocList = enzymeWrapper.find('.modal-body');
        tocList.children().forEach((node, i) => {
            const chapterIndex = i + SPECIAL_PAGES_COUNT;
            node.simulate('click');
            expect(props.closeTOC.mock.calls.length).toBe(i + 1);
            expect(props.goToBookItem.mock.calls.length).toBe(i + 1);
            expect(props.goToBookItem.mock.calls[i][0]).toBe(chapterIndex);
        });
    });
});