import * as React from 'react';
import classNames from 'classnames';
import './index.less'

export default class Avatar extends React.Component {
  static defaultProps = {
    shape: 'circle',
    size: 'default'
  };

  state = {
    scale: 1,
    mounted: false,
    isImgExist: true,
  };

  componentDidMount() {
    this.setScale();
    this.setState({ mounted: true });
  }

  componentDidUpdate(prevProps) {
    this.setScale();
    if (prevProps.src !== this.props.src) {
      this.setState({ isImgExist: true, scale: 1 });
    }
  }

  // 根据容器节点，和头像节点设置缩放
  setScale = () => {
    if (!this.avatarChildren || !this.avatarNode) {
      return;
    }
    const childrenWidth = this.avatarChildren.offsetWidth; // offsetWidth avoid affecting be transform scale
    const nodeWidth = this.avatarNode.offsetWidth;
    // 0 没意义
    if (
      childrenWidth === 0 ||
      nodeWidth === 0 ||
      (this.lastChildrenWidth === childrenWidth && this.lastNodeWidth === nodeWidth)
    ) {
      return;
    }
    // 用于缓存，防止重复计算
    this.lastChildrenWidth = childrenWidth;
    this.lastNodeWidth = nodeWidth;
    // 左右增加 4px,显得不那么挤
    this.setState({
      scale: nodeWidth - 8 < childrenWidth ? (nodeWidth - 8) / childrenWidth : 1,
    });
  };

  handleImgLoadError = () => {
    this.setState({ isImgExist: false });
  };

  render() {
    const {
      prefixCls: customizePrefixCls,
      shape,
      size,
      src,
      icon,
      className,
      ...others
    } = this.props;

    const { isImgExist, scale, mounted } = this.state;

    const prefixCls = 'ant-avatar';

    const sizeCls = classNames({
      [`${prefixCls}-lg`]: size === 'large',
      [`${prefixCls}-sm`]: size === 'small',
    });

    const classString = classNames(prefixCls, className, sizeCls, {
      [`${prefixCls}-${shape}`]: shape,
      [`${prefixCls}-image`]: src && isImgExist,
      [`${prefixCls}-icon`]: icon,
    });

    const sizeStyle =
      typeof size === 'number'
        ? {
            width: size,
            height: size,
            lineHeight: `${size}px`,
            fontSize: icon ? size / 2 : 18,
          }
        : {};

    let { children } = this.props;
    // NOTE: avatar 组件没有处理 loading 的情况
    if (src && isImgExist) {
      children = <img src={src} onError={this.handleImgLoadError} />;
    } else if (icon) {
      children = icon;
    } else {
      // NOTE: 文字 didMount 之后，setScale 触发的
      const childrenNode = this.avatarChildren;
      if (childrenNode || scale !== 1) {
        const childrenStyle = {
          transform: `scale(${scale}) translateX(-50%)`
        };

        const sizeChildrenStyle =
          typeof size === 'number'
            ? {
                lineHeight: `${size}px`,
              }
            : {};
        children = (
          <span
            className={`${prefixCls}-string`}
            ref={(node) => (this.avatarChildren = node)}
            style={{ ...sizeChildrenStyle, ...childrenStyle }}
          >
            {children}
          </span>
        );
      } else {
        // NOTE: 文字第一次渲染的时候
        const childrenStyle = {};
        if (!mounted) {
          childrenStyle.opacity = 0;
        }

        children = (
          <span
            className={`${prefixCls}-string`}
            style={{ opacity: 0 }}
            ref={(node) => (this.avatarChildren = node)}
          >
            {children}
          </span>
        );
      }
    }
    return (
      <span
        {...others}
        style={{ ...sizeStyle, ...others.style }}
        className={classString}
        ref={(node) => (this.avatarNode = node)}
      >
        {children}
      </span>
    );
  }
}