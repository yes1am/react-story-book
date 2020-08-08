import React, { Component } from 'react';
import classNames from 'classnames';

export default class Notice extends Component{
  constructor (props) {
    super(props);
    this.closeTimer = null;
    this.close = this.close.bind(this);
    this.clearCloseTimer = this.clearCloseTimer.bind(this);
    this.startCloseTimer = this.startCloseTimer.bind(this);
  }
  static defaultProps = {
    onClose () {},
    duration: 3,
    style: {
    }
  };

  componentDidMount () {
    this.startCloseTimer();
  }

  componentWillUnmount () {
    this.clearCloseTimer();
  }

  close (e) {
    if (e) {
      e.stopPropagation();
    }
    this.clearCloseTimer();
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  }

  startCloseTimer () {
    if (this.props.duration) {
      this.closeTimer = window.setTimeout(() => {
        this.close();
      }, this.props.duration * 1000);
    }
  }

  clearCloseTimer () {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  restartCloseTimer () {
    this.clearCloseTimer();
    this.startCloseTimer();
  }

  render () {
    const {
      prefixCls,
      className,
      style,
      children
    } = this.props;

    const componentClass = `${prefixCls}-notice`;

    const dataOrAriaAttributeProps = Object.keys(this.props).reduce(
      (acc, key) => {
        if (key.substr(0, 5) === 'data-' || key.substr(0, 5) === 'aria-' || key === 'role') {
          acc[key] = (this.props)[key];
        }
        return acc;
      },
      {}
    );

    return (
      <div
        className={classNames(componentClass, className)}
        style={style}
        onMouseEnter={this.clearCloseTimer}
        onMouseLeave={this.startCloseTimer}
        {...dataOrAriaAttributeProps}
      >
        <div className={`${componentClass}-content`}>{children}</div>
      </div>
    );
  }
}
