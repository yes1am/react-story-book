import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Portal from './portal'
import Popup from './popup'
import createChainedFunction from 'rc-util/lib/createChainedFunction';
import contains from 'rc-util/lib/Dom/contains';
import addEventListener from 'rc-util/lib/Dom/addEventListener';

class Trigger extends Component {
  constructor (props) {
    super(props)
    const visible = typeof props.visible === 'undefined' ? props.defaultVisible : props.visible
    this.state = {
      visible
    }

    this.onClick = this.onClick.bind(this)
    this.onDocumentClick = this.onDocumentClick.bind(this)
    this.setVisible = this.setVisible.bind(this)
    this.popupRef = React.createRef()
  }

  componentWillReceiveProps (nextProps) {
    if ('visible' in nextProps) {
      if (nextProps.visible !== this.state.visible) {
        this.setState({ visible: nextProps.visible })
      }
    }
  }

  componentDidMount () {
    this.componentDidUpdate(
      {},
      {
        visible: false
      }
    )
  }

  getPopupComponent () {
    this.isComponentHasRendered = true
    const { visible } = this.state
    const { popup } = this.props
    return <Popup
      ref={this.popupRef}
      wrap={this}
      align={{
        points: ['tl', 'bl']
      }}
      visible={visible}
    >
      {typeof popup === 'function' ? popup() : popup}
    </Popup>
  }

  onClick (e) {
    e.preventDefault()
    this.setVisible(!this.state.visible)
  }

  onDocumentClick (event) {
    const target = event.target
    const root = ReactDOM.findDOMNode(this)
    if (!contains(root, target) && !contains(ReactDOM.findDOMNode(this.popupRef.current), target)) {
      this.setVisible(false)
    }
  }

  setVisible (visible) {
    if (this.state.visible !== visible) {
      if (!('visible' in this.props)) {
        this.setState({
          visible
        })
      }
      this.props.onVisibleChange && this.props.onVisibleChange(visible)
    }
  }

  componentDidUpdate (_, prevState) {
    if (prevState.visible !== this.state.visible) {
      if (this.props.action.indexOf('click') !== -1) {
        if (this.state.visible) {
          if (!this.clickOutsideHandler) {
            this.clickOutsideHandler = addEventListener(document, 'click', this.onDocumentClick)
          }
          return
        }
      }
      if (this.clickOutsideHandler) {
        this.clickOutsideHandler.remove()
        this.clickOutsideHandler = null
      }
    }
  }
  render () {
    const child = React.Children.only(this.props.children)
    const childProps = child.props || {}

    const newChildProps = { key: 'trigger' }
    newChildProps.onClick = createChainedFunction(this.onClick, childProps.onClick)
    let trigger = React.cloneElement(child, newChildProps)

    let portal = null
    // if this.isComponentHasRendered, not remove the body > div
    if (this.state.visible || this.isComponentHasRendered) {
      portal = <Portal key='portal'>
        {this.getPopupComponent()}
      </Portal>
    }
    return [trigger, portal]
  }
}

export default Trigger