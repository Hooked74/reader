import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { getBodyContent } from '../utils';
import { 
    MIN_WIDTH_FOR_TWO_PAGES, 
    BOOK_STATUS_SUCCESS 
} from '../constants';

export default class Spread extends Component {
    static propTypes = {
        book: PropTypes.object.isRequired,
        bookItems: PropTypes.object.isRequired,
        resetPages: PropTypes.func.isRequired
    };

    __delay = 1000;
    __columnGap = 20;
    __timeout = null;
    __calculating = false;

    state = {
        textForBreakColumns: null,
        columnStyle: this.columnStyle
    };

    componentWillUpdate(props) {
        if (props.book.status === BOOK_STATUS_SUCCESS 
            && !props.bookItems.pages.length && !this.__calculating) {
            this.props = props;
            this.calculatePages(props);
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResizeWindow);    
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResizeWindow);
    }

    normalizeImage(image) {
        const imageRelations = this.props.book.data.imageRelations;
        if (image instanceof HTMLImageElement) {
            const pages = document.getElementById('pages');
            if (pages) image.style.maxHeight = getComputedStyle(pages).height;

            const imageSrc = image.getAttribute('src');
            if (imageRelations[imageSrc]) {
                return new Promise((resolve, reject) => {
                    image.onload = resolve;
                    image.onerror = reject;
                    image.src = imageRelations[imageSrc];
                })
                .catch(error => {
                    console.warn(`Не удалось загрузить картинку по адресу - ${imageRelations[imageSrc]}`);
                    console.error(`Произошла следующая ошибка - ${error}`);

                    const imageParagraph = image.parentNode;
                    if (imageParagraph.childNodes.length > 1) {
                        imageParagraph.removeChild(image);
                    } else {
                        imageParagraph.parentNode.removeChild(imageParagraph);
                    }
                });
            }
        }
        return Promise.resolve();
    }

    async updateBookItemImages(bookItemContent) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = bookItemContent;
        for (let image of wrapper.querySelectorAll('img')) {
            await this.normalizeImage(image);
        }
        return wrapper.innerHTML;
    }

    async calculatePages(props) {
        this.__calculating = true;
        this.setState({
            columnStyle: this.columnStyle
        });
        const pages = [];
        const book = props.book.data;
        const bookItems = [book.cover, book.titlePage, book.toc].concat(book.chapters);
        for (let bookItem of bookItems) {
            const bookItemContent = await this.updateBookItemImages(getBodyContent(bookItem.content));
            this.setState({
                textForBreakColumns: bookItemContent  
            });
            pages.push(this.getPagesFromBookItem(bookItemContent));
            if (!this.__calculating) return;
            break;
        }
        this.__calculating = false;
    }

    getPagesFromBookItem(sBookItemContent) {
        let left = 0;
        const columnWidth = parseFloat(this.state.columnStyle.columnWidth);
        const columnGap = parseFloat(this.state.columnStyle.columnGap) || 0;
        const fillingContainer = document.getElementById('fillingContainer');
        const fillingContainerPosition = fillingContainer.getBoundingClientRect();
        const fillingContainerTop = Math.ceil(fillingContainerPosition.top);
        const fillingContainerLeft = Math.ceil(fillingContainerPosition.left);
        const eBookItemContent = fillingContainer.firstChild;
        const result = {
            content: sBookItemContent,
            columnWidth: columnWidth + columnGap,
            pageCount: 0,
            leftIndents: [],
            startPositions: []
        };

        eBookItemContent.style.position = 'absolute';
        eBookItemContent.style.top = '0px';
        eBookItemContent.style.width = '100%';
        eBookItemContent.style.height = '100%';
        Object.assign(eBookItemContent.style, this.state.columnStyle);

        while (true) {
            eBookItemContent.style.left = `${left}px`;

            const pageStartRange = document.caretRangeFromPoint(fillingContainerLeft, fillingContainerTop);
            if (!pageStartRange || pageStartRange.startContainer === fillingContainer) break;
            let parentElement = pageStartRange.startContainer;
            while (true) {
                if (parentElement === document.body) {
                    throw new Error("Не верно найден родительский элемент при разбиении на страницы");
                }
                if (eBookItemContent === parentElement || eBookItemContent === parentElement.parentNode) break;
                parentElement = parentElement.parentNode;
            }
            if (pageStartRange.startContainer.nodeType == 3) {

            } else {

            }


            left += result.columnWidth;
        }
        
        // return {
        //     content: html,
        //     translateX: ['0px', '-100px'],
        //     startPoints: [{
        //         id: 'id',
        //         textOffset: 0
        //     }],
        //     pageCount: 20
        // }
    }

    @autobind
    handleResizeWindow() {
        clearTimeout(this.__timeout);
        this.__timeout = setTimeout(() => {
            this.__calculating = false;
            this.props.resetPages();
        }, this.__delay);
    }

    get isSinglePage() {
        return window.innerWidth < MIN_WIDTH_FOR_TWO_PAGES;
    }

    get columnStyle() {
        let columnStyle = {};
        const pages = document.getElementById('pages');
        if (pages) {
            const pagesStyle = getComputedStyle(pages);
            const width = parseFloat(pagesStyle.width);
            if (this.isSinglePage) {
                columnStyle.columnWidth = `${width}px`;   
            } else {
                columnStyle.columnGap = `${this.__columnGap}px`;  
                columnStyle.columnWidth = `${(width - this.__columnGap) / 2}px`;  
            }
        }

        return columnStyle;
    }

    // get leftContent() {
    //     const pages = this.props.bookItems.pages;
    //     const active = this.props.bookItems.active;
    //     const bookItemIndex = active.bookItemIndex;
    //     const pageIndex = active.pageIndex;

    //     return pages[bookItemIndex] && typeof pages[bookItemIndex][pageIndex] !== 'undefined'
    //         ? pages[bookItemIndex][pageIndex].component
    //         : null;
    // }

    // get rightContent() {
    //     const pages = this.props.bookItems.pages;
    //     const active = this.props.bookItems.active;
    //     let bookItemIndex = active.bookItemIndex;
    //     let pageIndex = active.pageIndex + 1;

    //     return pages[bookItemIndex] && typeof pages[bookItemIndex][pageIndex] !== 'undefined'
    //         || ((pageIndex = 0) || (bookItemIndex += 1)) 
    //         && pages[bookItemIndex] && typeof pages[bookItemIndex][pageIndex] !== 'undefined'
    //         ? pages[bookItemIndex][pageIndex].component
    //         : null;
    // }

    render() {
        return (
            <section id="spread">
                <div id="pages" style={this.state.columnStyle}>
                    <div id="fillingContainer" dangerouslySetInnerHTML={{__html: this.state.textForBreakColumns}}></div>
                </div>
            </section>
        );
    }
}