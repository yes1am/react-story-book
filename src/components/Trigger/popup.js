import React, { Component } from 'react'
import Align from 'rc-align'
import { Transition } from 'react-transition-group'
import ReactDOM from 'react-dom'
import './popup.css'

const defaultStyle = {
  position: 'absolute',
  transformOrigin: 'top',
  background: 'red'
}

const transitionStyles = {
  entering: { animation: 'fadeInDown 200ms' },
  entered: { animation: 'none' },
  exiting: { animation: 'fadeOutUp 200ms' },
  exited: { animation: 'none' }
}

class Popup extends Component {
  constructor (props) {
    super(props)
    this.getTarget = this.getTarget.bind(this)
    this.node = null;
    this.done = null;
  }
  getTarget () {
    return ReactDOM.findDOMNode(this.props.wrap)
  }
  componentWillUnmount() {
    if(this.node) {
      this.node.removeEventListener('animationend',this.done)
    }
  }
  render () {
    const { visible, children,align } = this.props
    return (
      <Transition
        mountOnEnter
        unmountOnExit
        appear
        addEndListener={(node,done)=>{
            // we need addEndListener or timeout to say: "my animation is complete"
            // but use timeout is not so reliable
            this.node = node;
            this.done = done;
            node.addEventListener("animationend", this.done)
        }}
        in={visible}
      >
        {state => {
          return <Align
            target={this.getTarget}
            monitorWindowResize
            align={align}
          >
            <div style={{
              ...defaultStyle,
              ...transitionStyles[state]
            }}>
              {children}
            </div>
          </Align>
        }}
      </Transition>
    )
  }
}

Popup.defaultProps = {
  align: {
    points: ['tl', 'bl']
  }
}

export default Popup