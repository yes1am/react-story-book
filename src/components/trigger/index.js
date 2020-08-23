import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Portal from './portal'
import Popup from './popup'
import createChainedFunction from 'rc-util/lib/createChainedFunction';
import addEventListener from 'rc-util/lib/Dom/addEventListener';

class Trigger extends Component {
  constructor (props) {
    super(props)
    const visible = typeof props.visible === 'undefined' ? props.defaultVisible : props.visible
    this.state = {
      visible
    }

    this.onClick = this.onClick.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
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
    const { popup,action } = this.props
    const popupProps = {action}
    if(action === 'hover') {
      popupProps.onMouseLeave = this.onMouseLeave
      popupProps.onMouseEnter = this.onMouseEnter
    }
    return <Popup
      ref={this.popupRef}
      wrap={this}
      {...popupProps}
      visible={visible}
    >
      {typeof popup === 'function' ? popup() : popup}
    </Popup>
  }

  onClick (e) {
    this.setVisible(!this.state.visible)
  }

  // when action is hover, and there are some distance between trigger element and popupelement
  // if mouseleave, we should set some time rather than immediate change visible
  delaySetPopupVisible(visible,delay = 200) {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }
    this.delayTimer = setTimeout(() => {
      this.setVisible(visible);
      this.delayTimer = null;
    }, delay);
  }

  onMouseEnter(e) {
    this.delaySetPopupVisible(true)
  }

  onMouseLeave(e) {
    this.delaySetPopupVisible(false)
  }

  onDocumentClick (event) {
    const target = event.target
    const root = ReactDOM.findDOMNode(this)
    if (!root.contains(target) && this.popupRef.current &&  !ReactDOM.findDOMNode(this.popupRef.current).contains(target)) {
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
      if (this.props.action === 'click') {
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

  componentWillUnmount() {
    if (this.clickOutsideHandler) {
      this.clickOutsideHandler.remove()
      this.clickOutsideHandler = null
    }
  }

  render () {
    const child = React.Children.only(this.props.children)
    const childProps = child.props || {}
    const {action}  =this.props;

    const newChildProps = { key: 'trigger' }
    if(action === 'click') {
      newChildProps.onClick = createChainedFunction(this.onClick, childProps.onClick)
    }

    if(action === 'hover') {
      newChildProps.onMouseEnter = createChainedFunction(this.onMouseEnter, childProps.onMouseEnter)
      newChildProps.onMouseLeave = createChainedFunction(this.onMouseLeave, childProps.onMouseLeave)
    }

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