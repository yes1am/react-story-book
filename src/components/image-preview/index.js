import React, { Component } from 'react'
import { createPortal } from 'react-dom'
import debounce from 'lodash.debounce'
import cx from 'classnames';
import './index.less';

export default class ImagePreview extends Component {
  constructor(props) {
    super(props)
    this.imgRef = React.createRef(null);
    this.imgContianerRef = React.createRef(null);
    this.needScale = false;
    this.hadLoaded = false;
    this.state = {
      isSmall: false,
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
  }

  static defaultProps = {
    src: 'https://www.google.com.hk/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'
  }

  handleClick() {
    const { isSmall } = this.state;
    if(this.needScale) {
      if(isSmall) {
        this.setState({
          isSmall: false
        },() => {
          const { clientWidth: w2, clientHeight: h2 }  = this.imgRef.current.ownerDocument.documentElement;

          if(this.originW > w2) {
            this.imgContianerRef.current.scrollLeft = Math.floor((this.originW - w2) / 2)
            this.imgRef.current.style.left = 0;
          }

          if(this.originH > h2) {
            this.imgContianerRef.current.scrollTop = Math.floor((this.originH - h2) / 2)
            this.imgRef.current.style.top = 0;
          }
        })
      } else {
        this.setState({
          isSmall: true
        })
      }
    }
  }

  handleLoad() {
    if(!this.imgRef || !this.imgRef.current) {
      return;
    }
    const { width: w1, height: h1 } = this.imgRef.current;
    this.originW = w1;
    this.originH = h1;

    const { clientWidth: w2, clientHeight: h2 }  = this.imgRef.current.ownerDocument.documentElement;
    if(w1 > w2 || h1 > h2) {
      this.needScale = true;
      this.setState({
        isSmall: true
      })
    }

    this.hadLoaded = true
    this.forceUpdate();
  }

  render() {
    const { isSmall } = this.state;
    const cls = this.needScale ? (isSmall ? 'is-small' : 'is-big')  : '';
    const normalCls = (this.hadLoaded && !this.needScale) ? 'normal' : '';
    const { src } = this.props;

    return (
      createPortal(
        <div className={cx('image-preview', cls)} ref={this.imgContianerRef}>
          <img
            onClick={this.handleClick}
            onLoad={this.handleLoad}
            className={cx(cls, normalCls)}
            ref={this.imgRef}
            src={src}
          />
        </div>, document.body
      )
    )
  }
}