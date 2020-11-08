import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ModalPortal from './ModalPortal';
import './index.less';

class Modal extends Component {
    createContainer() {
        const { getPopupContainer } = this.props;
        this.container = document.createElement('div');
        this.container.className = 'react-modal';
        const mountNode = getPopupContainer
            ? getPopupContainer()
            : document.body;
        mountNode.appendChild(this.container);
        // 利用 forceUpdate重新执行render
        this.forceUpdate();
    }
    componentDidMount() {
        this.createContainer();
    }
    componentWillUnmount() {
        this.removeContainer();
    }
    removeContainer() {
        if (this.container) {
            this.container.parentNode.removeChild(this.container);
        }
    }
    render() {
        if (this.container) {
            return ReactDOM.createPortal(<ModalPortal {...this.props}/>, this.container);
        }
        return null;
    }
}
export default Modal;