import React, { PureComponent } from 'react';
import Notice from './notice';
import classnames from 'classnames';
import ReactDOM from 'react-dom';
import {
  CSSTransition,
  TransitionGroup
} from 'react-transition-group';

import './index.less';

let seed = 0;
const now = Date.now();

function getUuid () {
  const id = seed;
  seed += 1;
  return `notification_${now}_${id}`;
}

function createChainedFunction (...args1) {

  if (args1.length === 1) {
    return args1[0];
  }

  return function chainedFunction (...args2) {
    for (let i = 0; i < args1.length; i++) {
      if (args1[i] && args1[i].apply) {
        args1[i].apply(this, args2);
      }
    }
  };
}

export default class Notification extends PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      notices: []
    };
  }

  static newInstance;

  static defaultProps = {
    prefixCls: 'notification',
    style: {
      top: 40,
      left: '50%',
      width: '100%',
      transform: 'translateX(-50%)',
    },
    maxCount: 3
  };

  add (notice) {
    // eslint-disable-next-line no-param-reassign
    notice.key = notice.key || getUuid();
    const { key } = notice;
    const { maxCount = 2 } = this.props;
    this.setState(previousState => {
      const { notices } = previousState;
      const noticeIndex = notices.map(v => v.notice.key).indexOf(key);
      const updatedNotices = notices.concat();
      if (noticeIndex !== -1) {
        updatedNotices.splice(noticeIndex, 1, { notice });
      } else {
        if (maxCount && notices.length >= maxCount) {
          updatedNotices.shift();
        }
        updatedNotices.push({ notice });
      }
      return {
        notices: updatedNotices
      };
    });
  }

  remove (key) {
    this.setState(previousState => ({
      notices: previousState.notices.filter(({ notice }) => notice.key !== key)
    }));
  }

  render () {
    const { notices } = this.state;
    const { prefixCls, className, style } = this.props;

    const noticeNodes = notices.map(({ notice }) => {
      const key = notice.key;
      const onClose = createChainedFunction(
        this.remove.bind(this, notice.key),
        notice.onClose
      );

      const noticeProps = {
        prefixCls,
        ...notice,
        ...notice.props,
        key,
        onClose,
        onClick: notice.onClick,
        children: notice.content
      };

      return (
        <CSSTransition
          key={key}
          timeout={200}
          classNames={`${prefixCls}-fade`}
          onEnter={(el) => {
            el.style.height = el.scrollHeight + 'px';
          }}
          onExit={(el) => {
            if (el.parentNode && el.parentNode.children.length > 1) {
              el.style.height = 0;
              el.style.marginBottom = 0;
            }
          }}
        >
          <div className={`${prefixCls}-item`}>
            <Notice {...noticeProps} />
          </div>
        </CSSTransition>
      );
    });
    return (
      <div className={classnames(prefixCls, className)} style={style}>
        <TransitionGroup component={null}>
          {noticeNodes}
        </TransitionGroup>
      </div>
    );
  }
}

Notification.newInstance = function newNotificationInstance (properties, callback) {
  const { getContainer, ...props } = properties || {};
  const div = document.createElement('div');
  if (getContainer) {
    const root = getContainer();
    root && root.appendChild(div);
  } else {
    document.body.appendChild(div);
  }
  let called = false;
  function ref (notification) {
    if (called) {
      return;
    }
    called = true;
    callback({
      notice (noticeProps) {
        notification.add(noticeProps);
      },
      removeNotice (key) {
        notification.remove(key);
      },
      component: notification,
      destroy () {
        ReactDOM.unmountComponentAtNode(div);
        if (div.parentNode) {
          div.parentNode.removeChild(div);
        }
      }
    });
  }

  ReactDOM.render(<Notification {...props} ref={ref} />, div);
};
