import React, {Component} from 'react'
import { PortalWithState } from 'react-portal'
import './index.less';

class Tooltip extends Component {
  constructor (props) {
    super(props)
    this.triggerRef = React.createRef();
    this.alignRef = React.createRef();
    this.updateStyle = this.updateStyle.bind(this)
  }

  updateStyle() {
    const trigger = this.triggerRef && this.triggerRef.current;
    const align = this.alignRef && this.alignRef.current;
    if (!trigger || !align) {
      return;
    }
    const arrowWidth = 8
    const { position, distanceFromTop, distanceAddonLeft } = this.props
    const result = trigger.getBoundingClientRect()
    const { left, top, width } = result
    const { width: alignWidth, height: alignHeight } = align.getBoundingClientRect();

    let leftStyle = 0;

    if(position === 'right') {
      leftStyle = left - (alignWidth - width)
    } else if (position === 'center') {
      leftStyle = left - (alignWidth - width) / 2
    } else {
      leftStyle = left;
    }

    align.style.top = (top - alignHeight - distanceFromTop - arrowWidth / 2) + 'px' ;
    align.style.left = (leftStyle + distanceAddonLeft) + 'px';
  }

  render () {
    const { children, title, hideOnClick, position } = this.props
    return (
      <PortalWithState closeOnOutsideClick onOpen={this.updateStyle}>
        {
          ({ openPortal, closePortal, isOpen, portal }) => {
            return (
              <div>
                <div
                  ref={this.triggerRef}
                  onMouseEnter={openPortal}
                  onMouseLeave={closePortal}
                  onClick={() => hideOnClick && closePortal()}
                >
                  {children}
                </div>
                {
                  portal(
                    <div ref={this.alignRef} className={`portal ${position}`}>
                      {title}
                    </div>
                  )
                }
              </div>
            )
          }
        }
      </PortalWithState>
    )
  }
}

Tooltip.defaultProps = {
  hideOnClick: false,
  position: 'center',
  distanceFromTop: 0,  // 距离顶部的距离
  distanceAddonLeft: 0 // left 新增的距离
}

export default Tooltip
