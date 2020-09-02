import React, { Component } from "react";
import PropTypes from "prop-types";
import { CSSTransition } from 'react-transition-group';

// so that our CSS is statically analyzable
const CLASS_NAMES = {
  overlay: "ReactModal__Overlay",
  content: "ReactModal__Content"
};

const htmlOpenClassName = 'ReactModal__Html--open';
const bodyOpenClassName = 'ReactModal__Body--open';

const ESC_KEY = 27;

export default class ModalPortal extends Component {
  static defaultProps = {
    style: {
      overlay: {},
      content: {}
    },
    defaultStyles: {}
  };

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible && !prevProps.visible) {
      this.afterOpen();
    } else if (!this.props.visible && prevProps.visible) {
      this.afterClose();
    }
  }

  componentWillUnmount() {
    if (this.props.visible) {
      this.afterClose();
    }
    clearTimeout(this.closeTimer);
    document.removeEventListener('keydown', this.onKeyDown);
  }

  afterClose = () => {
    document.getElementsByTagName("html")[0].classList.remove(htmlOpenClassName);
    document.body.classList.remove(bodyOpenClassName)
  };

  afterOpen = () => {
    document.getElementsByTagName("html")[0].classList.add(htmlOpenClassName);
    document.body.classList.add(bodyOpenClassName)
  };

  onKeyDown = event => {
    if (event.keyCode === ESC_KEY && this.props.shouldCloseOnEsc) {
      event.stopPropagation();
      this.handleVisibleChange(false);
    }
  };

  handleVisibleChange = visible => {
    const { onVisibleChange } = this.props;
    onVisibleChange && onVisibleChange(visible);
  }

  handleOverlayOnClick = event => {
    if (this.props.shouldCloseOnOverlayClick) {
      this.handleVisibleChange(false);
    }
  };

  render() {
    const {
      id,
      className,
      overlayClassName,
      defaultStyles,
      children
    } = this.props;
    const { visible } = this.props;
    const contentStyles = className ? {} : defaultStyles.content;
    const overlayStyles = overlayClassName ? {} : defaultStyles.overlay;

    return (
      <CSSTransition in={visible} unmountOnExit timeout={200} classNames="ReactModal__Overlay">
        <div
          className={CLASS_NAMES.overlay}
          style={{ ...overlayStyles, ...this.props.style.overlay }}
          onClick={this.handleOverlayOnClick}
        >
          <div
            id={id}
            style={{ ...contentStyles, ...this.props.style.content }}
            className={CLASS_NAMES.content}
            onKeyDown={this.onContentKeyDown}
            onClick={e => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      </CSSTransition>
    )
  }
}