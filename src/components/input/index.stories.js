import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Input from '.';

export default {
  title: '组件/Input',
  component: null,
  argTypes: {
  },
}

export const One = () => (
  <div style={{width:'240px'}}>
    <Input />
  </div>
);
One.storyName = 'Basic';

export const Two = () => (
  <div style={{width:'240px'}}>
    <Input disabled />
  </div>
);
Two.storyName = 'Disabled';

export const Three = () => (
  <div style={{width:'240px'}}>
    <Input clearable />
  </div>
);
Three.storyName = 'Clearable';

export const Four = () => (
  <>
    <div style={{ display: 'inline-block', width: '240px' }}>
      <Input size="small" />
    </div>
    <div style={{ display: 'inline-block', width: '240px' }}>
      <Input />
    </div>
    <div style={{ display: 'inline-block', width: '240px' }}>
      <Input size="large" />
    </div>
  </>
);
Four.storyName = 'Size';

export const Five = () => (
  <>
    <div style={{ display: 'inline-block', width: '240px' }}>
      <Input prefixLabel="$" />
    </div>
    <div style={{ display: 'inline-block', width: '240px' }}>
      <Input suffixLabel="days" />
    </div>
    <div style={{ display: 'inline-block', width: '240px' }}>
      <Input prefixIcon="search" />
    </div>
  </>
);
Five.storyName = 'Prefix And Suffix';

export const Six = () => (
  <div style={{display:'inline-block',width:'240px'}}>
    <Input maxLength={30} showWordLimit />
    <Input type="textarea" maxLength={40} showWordLimit />
  </div>
);
Six.storyName = 'showWordLimit';

export const Seven = () => (
  <div style={{width: '200px'}}>
    <Input placeholder="Please input number" restriction="number" />
  </div>
);
Seven.storyName = 'Restriction';

export const Eight = () => (
  <div style={{width: '240px'}}>
    <Input  error errorMessage="error message here"></Input>
  </div>
);
Eight.storyName = 'Error';

export const Nine = () => (
  <div style={{width: '240px'}}>
    <Input error errorMessage="error message here" />
    <Input error errorMessage="error message here" helpText="this is help text" />
    <Input
      help={<div className="custom-help">this is custom help div text, and you can difine anything you like there</div>}
    />
  </div>
);
Nine.storyName = 'Help';

export const Ten = () => {
  const [value, setValue] = useState('Textarea的第一个可拉伸输入框，有时候有滑动条，有时候又可以自己展开。没做过这样的交互设计?Textarea的第一个可拉伸输入框，有时候有滑动条，有时候又可以自己展开。没做过这样的交互设计');
  function onChange(newValue) {
    setValue(newValue);
  }
  return (
    <div style={{width: '220px'}}>
      <Input onChange={onChange} type="textarea" value={value} autosize />
      <Input type="textarea" onChange={onChange} value={value} helpText="this is help text" />
    </div>
  )
}

Ten.storyName = 'TextArea';