import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import Button from './button';
import Icon from './icon';

const stopPropagation = (e) => {
    e.stopPropagation();
};
export default class ModalPortal extends Component {
    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.cancelOnMask = this.cancelOnMask.bind(this);
    }
    componentDidUpdate(prevProps) {
        const { visible } = this.props;
        if (visible && !prevProps.visible) {
            this.afterOpen();
        }
        else if (!visible && prevProps.visible) {
            this.afterClose();
        }
    }
    componentWillUnmount() {
        const { visible } = this.props;
        if (visible) {
            this.afterClose();
        }
    }
    /** 当关闭 modal 时，应该执行的函数 */
    afterClose() {
        const { afterClose } = this.props;
        if (afterClose) {
            afterClose();
        }
    }
    /** 在打开 modal 之后应该执行的函数 */
    afterOpen() {
        const { afterClose } = this.props;
        if (afterClose) {
            afterClose();
        }
    }
    cancelOnMask(e) {
        e.stopPropagation();
        const { closeOnClickMask } = this.props;
        if (closeOnClickMask) {
            this.handleCancel();
        }
    }
    handleClose() {
        const { emitClose, onClose } = this.props;
        if (emitClose) {
            onClose();
        }
        else {
            this.handleCancel();
        }
    }
    handleCancel() {
        const { onCancel } = this.props;
        onCancel && onCancel();
    }
    handleConfirm() {
        const { onConfirm } = this.props;
        onConfirm && onConfirm();
    }
    render() {
        const { children, visible, size, center, title, subtitle, showCancel, isCancelDisabled, isCancelLoading, showConfirm, isConfirmDisabled, isConfirmLoading, showClose, content, footerAssist, contentSlot, } = this.props;
        const contentClass = classNames('react-modal__content', {
            [`react-modal__content--${size}`]: size,
            'react-modal__content--center': center,
        });
        const overHeight = null;
        const bodyClass = classNames('react-modal__body', {
            'over-height': overHeight,
        });
        // const footerClass = classNames()
        const localCancelText = 'cancel';
        const localConfirmText = 'confirm';
        const showFooter = !!(footerAssist || showCancel || showConfirm);
        const footerClass = classNames('react-modal__footer', {
            'with-assist': footerAssist,
        });
        return (<CSSTransition in={visible} unmountOnExit timeout={200} classNames="react-modal-fade-fast">
        <div className="react-modal__mask">
          <div className="react-modal__container" onClick={this.cancelOnMask}>
            <CSSTransition in={visible} unmountOnExit timeout={200} classNames="react-modal-move-down-fast">
              <div className="react-modal__box" onClick={stopPropagation}>
                <div className={contentClass}>
                  {contentSlot || (<>
                      {!!title && (<div className="react-modal__header">
                          <div className="react-modal__header-inner">
                            <div className="react-modal__title">{title}</div>
                            {!!subtitle && <div className="react-modal__subtitle">{subtitle}</div>}
                          </div>
                        </div>)}
                      <div className={bodyClass}>
                        {children || content}
                      </div>
                      {showFooter && (<div className={footerClass}>
                          {footerAssist}
                          <div className="react-modal__footer-buttons">
                            {!!showCancel && (<Button onClick={this.handleCancel} disabled={isCancelDisabled} loading={isCancelLoading}>
                                {localCancelText}
                              </Button>)}
                            {!!showConfirm && (<Button type="primary" onClick={this.handleConfirm} disabled={isConfirmDisabled} loading={isConfirmLoading}>
                                {localConfirmText}
                              </Button>)}
                          </div>
                        </div>)}
                    </>)}
                </div>
                {!!showClose && (<span onClick={this.handleClose}>
                    <Icon className="react-modal__close" type="close"/>
                  </span>)}
              </div>
            </CSSTransition>
          </div>
        </div>
      </CSSTransition>);
    }
}
ModalPortal.defaultProps = {
    showCancel: true,
    showConfirm: true,
    showClose: true,
    size: 'normal',
};