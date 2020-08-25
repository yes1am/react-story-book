import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Notification from '.';

export default {
  title: '组件/Notification',
  component: null,
  argTypes: {
  },
}


let i = 0;

// 接受参数进行 toast 的示例
const Toast = (props) => {
  useEffect(() => {
    Notification.open({
      message: props.msg
    })
  }, [props.msg])
  return null;
}

export const One = () => {
  const [msg, setMsg] = useState('我是 toast');
  return <div onClick={() => setMsg(`我是 toast ${i++}`)}>
    点击我
    <Toast msg={msg} />
  </div>
}
  
One.storyName = '提醒';