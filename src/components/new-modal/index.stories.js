import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '.';
import Button from './button';
import Icon from './icon';

export default {
  title: '组件/New Modal',
  component: null,
  argTypes: {
  },
}

export const One = () => {
  const [basicVisible, setBasicVisible] = useState(false);
  return (
    <div>
      <Button onClick={() => setBasicVisible(true)}>Open Basic Modal</Button>
      <Modal
        title="Alarm"
        content="Please notice that all the changes will be removed."
        visible={basicVisible}
        onCancel={() => setBasicVisible(false)}
        onConfirm={() => setBasicVisible(false)}
      ></Modal>
    </div>
  )
}
One.storyName = 'Basic';

export const Two = () => {
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  return (
    <div>
      <Button onClick={() => setSubtitleVisible(true)}>Open Modal with Subtitle</Button>
      <Modal
        title="Alarm"
        subtitle="This is a subtitle"
        content="Please notice that all the changes will be removed."
        visible={subtitleVisible}
        onCancel={() => setSubtitleVisible(false)}
        onConfirm={() => setSubtitleVisible(false)}
      ></Modal>
    </div>
  )
}
Two.storyName = 'Subtitle';

export const Three = () => {
  const [longVisible, setLongVisible] = useState(false);
  return (
    <div>
      <Button onClick={() => setLongVisible(true)}>Open Long Modal</Button>
      <Modal
        title="Alarm"
        className="long-modal"
        visible={longVisible}
        onCancel={() => setLongVisible(false)}
        onConfirm={() => setLongVisible(false)}
      >
        Please notice that all the changes will be removed. Long long long long long long long long long long long
        long long long long long long long long long long long long long long long long long long long long long long
        long long long long long long long long long long long long long long long long long long long long long long
        long long long long long long long long long long long long long long long long long long long long long long
        long long long long long long long long long long long long long long long long long long long long long long
        long long long long long long long long long long long long long long long long long long long long long long
        long long long long long long long long long long long long long long long content.
      </Modal>
    </div>
  )
}
Three.storyName = 'Long content body';

export const Four = () => {
  const [normalVisible, setNormalVisible] = useState(false);
  const [mediumVisible, setMediumVisible] = useState(false);
  const [largeVisible, setLargeVisible] = useState(false);
  const [xLargeVisible, setXLargeVisible] = useState(false);
  return (
    <div>
      <Button onClick={() => setNormalVisible(true)}>Normal Modal</Button>
      <Button onClick={() => setMediumVisible(true)}>Medium Modal</Button>
      <Button onClick={() => setLargeVisible(true)}>Large Modal</Button>
      <Button onClick={() => setXLargeVisible(true)}>XLarge Modal</Button>
      <Modal
        title="Normal Modal"
        content="Normal Modal Content"
        visible={normalVisible}
        onCancel={() => setNormalVisible(false)}
        onConfirm={() => setNormalVisible(false)}
      ></Modal>
      <Modal
        size="medium"
        title="Medium Modal"
        content="Medium Modal Content"
        visible={mediumVisible}
        onCancel={() => setMediumVisible(false)}
        onConfirm={() => setMediumVisible(false)}
      ></Modal>
      <Modal
        size="large"
        title="Large Modal"
        content="Large Modal Content"
        visible={largeVisible}
        onCancel={() => setLargeVisible(false)}
        onConfirm={() => setLargeVisible(false)}
      ></Modal>
      <Modal
        size="x-large"
        title="EX Large Modal"
        content="EX Large Modal Content"
        visible={xLargeVisible}
        onCancel={() => setXLargeVisible(false)}
        onConfirm={() => setXLargeVisible(false)}
      ></Modal>
    </div>
  )
}
Four.storyName = 'Different Size';

export const Five = () => {
  const [centerVisible, setCenterVisible] = useState(false);
  return (
    <div>
      <Button onClick={() => setCenterVisible(true)}>
        Open Center Modal
      </Button >
      <Modal
        center
        title="Alarm"
        content="Please notice that all the changes will be removed."
        visible={centerVisible}
        onCancel={() => setCenterVisible(false)}
        onConfirm={() => setCenterVisible(false)}
      >
      </Modal>
    </div>
  )
}
Five.storyName = 'Center';

export const Six = () => {
  const [footerVisible, setFooterVisible] = useState(false);
  return (
    <div>
      <Button onClick={() => setFooterVisible(true)}>
        Open Modal with Footer Assist
      </Button>
      <Modal
        title="Alarm"
        content="Please notice that all the changes will be removed."
        visible={footerVisible}
        onCancel={() => setFooterVisible(false)}
        onConfirm={() => setFooterVisible(false)}
        footerAssist={<Button type="link" style={{'line-height': '30px'}}>Text Button</Button>}
      >
      </Modal>
    </div>
  )
}
Six.storyName = 'Footer assist';

export const Seven = () => {
  const [customVisible, setCustomVisible] = useState(false);
  return (
    <div>
      <Button onClick={() => setCustomVisible(true)}>
        Open Custom Modal
      </Button>
      <Modal
        title="Basic Modal"
        visible={customVisible}
        onCancel={() => setCustomVisible(false)}
        onConfirm={() => setCustomVisible(false)}
      >
        <div>自定义内容</div>
      </Modal>
    </div>
  )
}
Seven.storyName = 'Custom Content';

export const Eight = () => {
  const [customFooterVisible, setCustomFooterVisible] = useState(false);
  return (
    <div>
      <Button onClick={() => setCustomFooterVisible(true)}>
        Open Modal without Footer
      </Button>
      <Modal
        title="Title"
        visible={customFooterVisible}
        showConfirm={false}
        showCancel={false}
        onCancel={() => setCustomFooterVisible(false)}
      >
      </Modal>
    </div>
  )
}
Eight.storyName = 'Custom Modal without Footer';

export const Nine = () => {
  const [customAllVisible, setCustomAllVisible] = useState(false);
  return (
    <div>
      <Button onClick={() => setCustomAllVisible(true)}>
        Open Modal
      </Button>
      <Modal
        title="Basic Modal"
        visible={customAllVisible}
        center
        onCancel={() => setCustomAllVisible(false)}
        onConfirm={() => setCustomAllVisible(false)}
        contentSlot={(
          <div className="success-content">
            <Icon type="success" />
            <div className="title">
              Successfully
            </div>
            <div className="desc">
              You have successful generated 10 pickup codes，now you can download these labels, or link orders for them.
            </div>
            <Button type="primary" onClick={() => setCustomAllVisible(false)}>
              Confirm
            </Button>
          </div>
        )}
      >
      </Modal>
    </div>
  )
}
Nine.storyName = 'Custom All Content';

export const Ten = () => {
  return (
    <div>
      <Button
        onClick={() => Modal.alarm({
          title: 'Alarm',
          content: 'This is an alarm!!!'
        })}
      >
        Alarm
      </Button>
      <Button onClick={() => Modal.confirm({
        title: 'Confirm',
        content: 'This is a confirm!!!',
      })}>
      Confirm
      </Button>
      <Button onClick={() => Modal.confirm({
        title: 'AsyncConfirm',
        content: 'This is an async confirm, will be closed 3 seconds after confirm clicked',
        onConfirm() {
          return new Promise(function (resolve) {
            setTimeout(function () {
              resolve();
            }, 3000);
          });
        }
      })}
      >
        AsyncConfirm
      </Button>
      <Button onClick={() => Modal.confirm({
        title: 'AsyncConfirm',
        content: <div>我是异步关闭 modal</div>,
        onConfirm() {
          return new Promise(function (resolve) {
            setTimeout(function () {
              resolve();
            }, 3000);
          });
        }
      })}
      >
        CustomContent
      </Button>
    </div>
  )
}

Ten.storyName = 'Instantiation Usage';