import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Spread from '../components/Spread';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import TocModal from '../components/TocModal';

import * as actions from '../actions';
import { BOOK_STATUS_ERROR, BOOK_STATUS_SUCCESS } from '../constants';
import { insertStyles } from '../utils';

const mapStateToProps = state => state;

@connect(mapStateToProps, actions)
export default class App extends Component {
    static propTypes = {
        book: PropTypes.object.isRequired,
        bookItems: PropTypes.object.isRequired,
        loading: PropTypes.object.isRequired,
        tocIsOpen: PropTypes.bool.isRequired,
        load: PropTypes.func.isRequired,
        openTOC: PropTypes.func.isRequired,
        closeTOC: PropTypes.func.isRequired,
        goToBookItem: PropTypes.func.isRequired,
        resetPages: PropTypes.func.isRequired
    };

    __includeStyles = false;

    constructor(props) {
        super(props);
        this.props.load();
    }

    componentWillUpdate(props) {
        if (!this.__includeStyles && props.book.status === BOOK_STATUS_SUCCESS) {
            const styles = props.book.data.stylesheetRelations;
            for (let key in styles) insertStyles(styles[key]);
            this.__includeStyles = true;
        }
        if (props.book.status === BOOK_STATUS_ERROR) this.handleErrorQuery(props);
        if (props.loading.visible) this.props.stopLoading(); // TODO: временно  
    }

    handleErrorQuery(props) {
        console.error("Произошла ошибка загрузки книги", props.book.error);
        location.replace(PORTAL_URL);
    }

    render() {
        return (
            <div id="application">
                <div id="contentWrapper">
                    <div id="content" className={this.props.tocIsOpen ? 'open-toc' : ''}>
                        <div id="mainContent">
                            <Header 
                                book={this.props.book}
                                tocIsOpen={this.props.tocIsOpen}
                                openTOC={this.props.openTOC}
                                closeTOC={this.props.closeTOC}/>    
                            <Navigation align="left" />  
                            <Spread 
                                book={this.props.book}
                                bookItems={this.props.bookItems}
                                resetPages={this.props.resetPages}/>    
                            <Navigation align="right" />    
                            <Footer />
                        </div>
                        <TocModal
                            book={this.props.book}
                            tocIsOpen={this.props.tocIsOpen}
                            closeTOC={this.props.closeTOC}
                            pageCountCollection={this.props.bookItems.pageCountCollection}
                            goToBookItem={this.props.goToBookItem}/>
                    </div>
                    <Loader {...this.props.loading}/>
                </div>
            </div>
        );
    }
}