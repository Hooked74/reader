import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { BOOK_STATUS_SUCCESS, SPECIAL_PAGES_COUNT } from '../constants';

export default class TocModal extends Component {
    static propTypes = {
        book: PropTypes.object.isRequired,
        tocIsOpen: PropTypes.bool.isRequired,
        closeTOC: PropTypes.func.isRequired,
        pageCountCollection: PropTypes.array.isRequired,
        goToBookItem: PropTypes.func.isRequired
    };

    @autobind
    goToChapter(e) {
        e.preventDefault();
        this.props.closeTOC();
        this.props.goToBookItem(parseInt(e.currentTarget.getAttribute('data-index')));
    }

    get overlayClassName() {
        let className = "overlay overlay-transparent";
        if (!this.props.tocIsOpen) className += " hidden";

        return className;
    }

    get tocList() {
        const tocList = [];
        const book = this.props.book;

        if (book.status === BOOK_STATUS_SUCCESS) {
            const tocItems = book.data.ncx.navMap.navPointItems;
            const pageCountCollection = this.props.pageCountCollection;
            let page = pageCountCollection.slice(0, SPECIAL_PAGES_COUNT).reduce((p, n) => p + n, 0) || NaN;
            for (let i = SPECIAL_PAGES_COUNT; i < tocItems.length; i++) {
                let nextPage = page + pageCountCollection[i];
                tocList.push(
                    <a
                        href="#" 
                        className={`tocitem${Number.isFinite(pageCountCollection[i]) ? '' : ' disabled'}`}
                        data-index={i}
                        key={i}
                        onClick={this.goToChapter}>
                        <span className="title">{tocItems[i].navLabel}</span>
                        <span className="pagenumber">
                            {nextPage ? page + 1 : <i className="fa fa-spinner fa-spin"></i>}
                        </span>
                    </a>
                );
                page = nextPage;
            }
        }

        return tocList;
    }

    render() {
        return (
            <section id="tocModalWrapper">
                <div className={this.overlayClassName} onClick={this.props.closeTOC}>
                </div>
                <div className="modal modal-left modal-toc">
                    <div className="modal-header">Оглавление</div>
                    <div className="modal-body">{this.tocList}</div>
                </div>
            </section>
        );
    }
}