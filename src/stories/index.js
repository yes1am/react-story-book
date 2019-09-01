import React,{ useState } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import Trigger from '../components/Trigger'

const TriggerClick = () => {
  const [visible, setVisible] = useState(false)
  return <Trigger
    action={['click']}
    onVisibleChange={(visible) => { setVisible(visible) }}
    popup={
      <span>this is trigger click demo</span>
    }
    visible={visible}
  >
    <span>
      click here
    </span>
  </Trigger>
}

storiesOf('Trigger', module).add('click', () => <TriggerClick />)