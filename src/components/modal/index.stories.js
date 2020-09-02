import React, { useState, useEffect } from 'react';
import Modal from '.';

export default {
  title: '组件/Modal',
  component: Modal,
  argTypes: {
  },
}

export const One = () => {
  const [visible,setVisible] = React.useState(false);

  return <div>
    <div onClick={() => setVisible(true)}>点我</div>
    <Modal
      visible={visible}
      onVisibleChange={ visible => setVisible(visible) }
    >
      <button onClick={() => setVisible(false)}>关闭</button> modal
    </Modal>
  </div>
}
  
One.storyName = 'Modal';