import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';

export default class Header extends Component {
    static propTypes = {
        book: PropTypes.object.isRequired,
        tocIsOpen: PropTypes.bool.isRequired,
        openTOC: PropTypes.func.isRequired,
        closeTOC: PropTypes.func.isRequired
    };

    @autobind
    goToPortal() {
        location.replace(PORTAL_URL);
    }

    @autobind
    toggleTOC() {
        this.props.tocIsOpen ? this.props.closeTOC() : this.props.openTOC();
    }

    get tocIcon() {
        return this.props.tocIsOpen ? 'fa-arrow-left' : 'fa-bars'; 
    }

    get headerCenter() {
        const book = this.props.book;
        let bookName = 'Название книги';
        let author = 'Автор';

        if (book.data) {
            let metaBookName = book.data.package.metadata.title[0].value.trim();
            let metaAuthor = book.data.package.metadata.creator[0].value.trim();
            if (metaBookName) bookName = metaBookName;
            if (metaAuthor) author = metaAuthor;
        }

        return (
            <div className="header-center-wrapper">
                <h1>{bookName}</h1>
                <h2>{author}</h2>
            </div>
        );
    }

    render() {
        return (
            <header id="header">
                <div className="header-left">
                    <div className="logo" onClick={this.goToPortal}>
                        <img src="/images/logo.png" />    
                    </div>
                    <i id="tocOpener" className={`fa ${this.tocIcon}`} aria-hidden="true" onClick={this.toggleTOC}></i>    
                </div>
                <hgroup className="header-center">{this.headerCenter}</hgroup>
                <div className="header-right">
                    <i className="fa fa-bookmark-o" id="bookmarkIcon" aria-hidden="true"></i>       
                </div>
            </header>
        );
    }
}