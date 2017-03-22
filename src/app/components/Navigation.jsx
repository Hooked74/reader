import React, { Component, PropTypes } from 'react';

export default class Navigation extends Component {
    static propTypes = {
        align: PropTypes.string.isRequired
    };

    render() {
        return <aside className={`navigation-${this.props.align}`}></aside>;
    }
}