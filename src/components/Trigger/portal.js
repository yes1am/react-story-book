import { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

/**
 * Portal组件
 * <Portal
 * getPopupContainer={() => {}}
 * >
 *  <ChildComponent>
 * </Portal>
 * 
 * 将 ChildComponent 组件渲染在 document.body || getPopupContainer 返回的dom节点上
 */

class Portal extends Component {
  componentDidMount () {
    this.createContainer()
  }

  componentWillUnmount () {
    this.removeContainer()
  }

  createContainer () {
    // eslint-disable-next-line
    const { getPopupContainer, document = window.document } = this.props
    this.container = document.createElement('div')
    this.container.style.position = 'absolute'
    this.container.style.top = '0'
    this.container.style.left = '0'
    this.container.style.width = '100%'
    const mountNode = getPopupContainer
      ? getPopupContainer()
      : document.body
    mountNode.appendChild(this.container)
    // 利用 forceUpdate重新执行render
    this.forceUpdate()
  }

  removeContainer () {
    if (this.container) {
      this.container.parentNode.removeChild(this.container)
    }
  }

  render () {
    if (this.container) {
      return ReactDOM.createPortal(this.props.children, this.container)
    }
    return null
  }
}

Portal.propTypes = {
  getPopupContainer: PropTypes.func
}

export default Portal
