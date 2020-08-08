import React,{ useState } from 'react';

import { storiesOf } from '@storybook/react';
import Trigger from '../components/Trigger';
import Notification from '../components/Notification';

const TriggerType = ({type}) => {
  const [visible, setVisible] = useState(false)
  return <Trigger
    action={type}
    onVisibleChange={(visible) => { setVisible(visible) }}
    popup={
      <span>this is trigger {type} demo</span>
    }
    visible={visible}
  >
    <span>
      {type} here
    </span>
  </Trigger>
}

let i = 0;
const NotificationType = ({type}) => {
  return <div onClick={
    () => Notification.open({
    message: `我是 toast ${i++}`
  })}>
    toast
  </div>
}

storiesOf('Trigger', module)
.add('click', () => <TriggerType type='click' />)
.add('hover', () => <TriggerType type='hover' />)

storiesOf('Notification', module)
.add('notification', () => <NotificationType />)