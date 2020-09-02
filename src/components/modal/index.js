import React, { Component } from "react";
import ReactDOM from "react-dom";
import ModalPortal from "./ModalPortal";
import './index.less'

const defaultStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,.45)"
  },
  content: {
    position: "absolute",
    top: "40px",
    left: "40px",
    right: "40px",
    bottom: "40px",
    border: "1px solid #ccc",
    background: "#fff",
    overflow: "auto",
    borderRadius: "4px",
    outline: "none",
    padding: "20px"
  }
}

class Modal extends Component {
  constructor(props) {
    super(props)
    this.portalRef = React.createRef(null);
  }
  static defaultProps = {
    shouldCloseOnEsc: true,
    shouldCloseOnOverlayClick: true,
  };

  createContainer () {
    // eslint-disable-next-line
    const { getPopupContainer, document = window.document } = this.props
    this.container = document.createElement('div')
    this.container.className = "ReactModalPortal";
    const mountNode = getPopupContainer
      ? getPopupContainer()
      : document.body
    mountNode.appendChild(this.container)
    // 利用 forceUpdate重新执行render
    this.forceUpdate()
  }

  componentDidMount() {
    this.createContainer();
  }

  componentWillUnmount() {
    this.removeContainer();
  }

  removeContainer = () => {
    if (this.container) {
      this.container.parentNode.removeChild(this.container)
    }
  };

  render() {
    if (this.container) {
      return ReactDOM.createPortal(
        <ModalPortal
          ref={this.portalRef}
          defaultStyles={defaultStyles}
          {...this.props}
        />, this.container
      )
    }
    return null;
  }
}

export default Modal;
