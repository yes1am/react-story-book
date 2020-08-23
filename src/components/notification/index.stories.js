import React from 'react';
import PropTypes from 'prop-types';
import Notification from '.';

export default {
  title: '组件/Notification',
  component: null,
  argTypes: {
  },
}


let i = 0;

export const One = () => (
  <div onClick={
    () => Notification.open({
    message: `我是 toast ${i++}`
  })}>
    点击我
  </div>
)

One.storyName = '提醒';