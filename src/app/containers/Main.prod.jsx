import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import App from './App';

export default class Main extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired
    };

    render() {
        return (
            <Provider store={this.props.store}>
                <App />
            </Provider>
        );
    }
}