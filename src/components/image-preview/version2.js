import React, { Component } from 'react'
import { createPortal } from 'react-dom'
import debounce from 'lodash.debounce'
import cx from 'classnames';
import xx from './a.jpg';
import './index.less';

export default class ImagePreview extends Component {
  constructor(props) {
    super(props)
    this.imgRef = React.createRef(null);
    this.imgContianerRef = React.createRef(null);
    this.window = null;
    this.needScale = false;
    this.hadLoaded = false;
    this.state = {
      width: 0,
      height: 0,
      zoomIn: false,
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
    this.debounceLoad = debounce(this.handleLoad, 1000 / 60, { maxWait: 1000 / 60, leading: true, trailing: false })
  }

  componentDidMount() {
    this.window = this.imgRef && this.imgRef.current && this.imgRef.current.ownerDocument.defaultView;
    this.window.addEventListener('resize', this.debounceLoad)
  }

  componentWillUnmount() {
    this.window.removeEventListener('resize', this.debounceLoad)
  }

  handleClick() {
    const { zoomIn } = this.state;
    if(this.needScale) {
      if(zoomIn) {
        this.handleLoad()
        this.setState({
          zoomIn: false
        }, () => {
          if(this.imgContianerRef && this.imgContianerRef.current) {
            this.imgContianerRef.current.style.overflow = '';
          }
        })
      } else {
        this.setState({
          zoomIn: true,
          width: this.originW,
          height: this.originH
        }, () => {
          if(this.imgContianerRef && this.imgContianerRef.current) {
            this.imgContianerRef.current.style.overflow = 'auto';
          }
        })
      }
    }
  }

  handleLoad() {
    if(!this.imgRef || !this.imgRef.current) {
      return;
    }
    
    const { width: w1, height: h1 } = this.imgRef.current;

    if(this.originW === undefined) {
      this.originW = w1
    }

    if(this.originH === undefined) {
      this.originH = h1
    }
    const { clientWidth: w2, clientHeight: h2 }  = this.imgRef.current.ownerDocument.documentElement;
    let newW = this.originW;
    let newH = this.originH;

    // 如果有 0 的情况，则不处理
    if([this.originW, w2, this.originH, h2].includes(0)) {
      return;
    }

    // 以高度为前提的情况
    if( (this.originW > w2 && this.originW / w2 <= this.originH / h2) || (this.originW === w2 && this.originH > h2) || (this.originW < w2 && this.originH > h2) ) {
      newW = Math.floor(this.originW / (this.originH / h2));
      newH = h2;
      // 只有第一次的计算才作为 needScale 标准
      if(!this.hadLoaded) {
        this.needScale = true;
      }
    }

    // 以宽度为前提的情况
    if( (this.originW > w2 && (this.originW / w2 > this.originH / h2)) ) {
      newH = Math.floor(this.originH / (this.originW / w2));
      newW = w2;
      if(!this.hadLoaded) {
        this.needScale = true;
      }
    }

    this.hadLoaded = true;
    this.setState({
      width: newW,
      height: newH
    })
  }

  render() {
    const { zoomIn, width, height } = this.state;
    const style = width && height ? { width, height }  : {};
    const cls = this.needScale ? (zoomIn ? 'zoom-out' : 'zoom-in')  : '';

    return (
      createPortal(
        <div className="image-preview" ref={this.imgContianerRef}>
          <img
            onClick={this.handleClick}
            onLoad={this.debounceLoad}
            className={cls}
            ref={this.imgRef}
            src={xx}
            style={style}
          />
        </div>, document.body
      )
    )
  }
}