import React,{ useState } from 'react';

import { storiesOf } from '@storybook/react';
import Trigger from '../components/Trigger'

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

storiesOf('Trigger', module)
.add('click', () => <TriggerType type='click' />)
.add('hover', () => <TriggerType type='hover' />)