import React, { Component, PropTypes } from 'react';

export default class Loader extends Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        message: PropTypes.string
    };

    render() {
        return (
            <div id="loader" className={this.props.visible ? '' : 'hidden'}>
                <div className="content">
                    <div className="line-mask">
                        <div className="line"></div>
                    </div>
                    <div className="text">
                        <span className="replace-text">{this.props.message}</span>
                        <span className="dot1">.</span>
                        <span className="dot2">.</span>
                        <span className="dot3">.</span>
                    </div>
                </div>
            </div>
        );
    }
}