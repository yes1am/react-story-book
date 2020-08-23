import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Trigger from '.';

export default {
  title: '组件/Trigger',
  component: null,
  argTypes: {
  },
}

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

export const One = () => <TriggerType type='click' />

One.storyName = '点击';

export const Two = () => <TriggerType type='hover' />

Two.storyName = 'Hover';
