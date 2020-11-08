import React, { useState } from 'react';
import PropTypes from 'prop-types';
import NumberInput from '.';

export default {
  title: '组件/NumberInput',
  component: null,
  argTypes: {
  },
}

export const One = () => {
  const [value, setValue] = useState(1)
  return (
    <div style={{width: 400}}>
      <NumberInput onChange={newValue => setValue(newValue)} value={value} />
    </div>
  )
}
One.storyName = 'Basic';

export const Two = () => {
  const [value, setValue] = useState(1)
  return (
    <div style={{width: 400}}>
      <NumberInput disabled onChange={newValue => setValue(newValue)} value={value} />
    </div>
  )
}
Two.storyName = 'Disabled';

export const Three = () => {
  const [value, setValue] = useState(1)
  return (
    <div style={{width: 400}}>
      <NumberInput value={value} onChange={newValue => setValue(newValue)} min={1} max={10} />
    </div>
  )
}
Three.storyName = 'Min & Max';

export const Four = () => {
  const [value, setValue] = useState(1)
  return (
    <div style={{width: 400}}>
      <NumberInput value={value} onChange={newValue => setValue(newValue)} step={5} />
    </div>
  )
}
Four.storyName = 'Step';

export const Five = () => {
  const [value, setValue] = useState(1)
  return (
    <>
      <div style={{width: 400}}>
        <NumberInput value={value} onChange={newValue => setValue(newValue)} prefixLabel="$" />
      </div>
      <div style={{width: 400}}>
        <NumberInput value={value} onChange={newValue => setValue(newValue)} suffixLabel="days" />
      </div>
    </>
  )
}
Five.storyName = 'Prefix & Suffix';

export const Six = () => {
  const [value, setValue] =useState(1)
  return (
    <div style={{width: 400}}>
      <NumberInput value={value} onChange={newValue => setValue(newValue)} precision={2}></NumberInput>
    </div>
  )
}
Six.storyName = '精度';

export const Seven = () => {
  const [value, setValue] =useState(1)
  return (
    <div style={{width: 400}}>
      <NumberInput
        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        value={value}
        onChange={newValue => setValue(newValue)}
        parser={value => value.replace(/\$\s?|(,*)/g, '')}
      />
    </div>
  )
}
Seven.storyName = 'Formatter';

export const Eight = () => {
  const [value, setValue] =useState(1)
  return (
    <div style={{width: 400}}>
      <NumberInput value={value} onChange={newValue => setValue(newValue)} error errorMessage="error message here" />
    </div>
  )
}
Eight.storyName = 'Error';