import React from 'react';
import PropTypes from 'prop-types';
import { Img, useImage } from '.';

export default {
  title: '组件/React-Image',
  component: null,
  argTypes: {
  },
}


export const One = () => (
  <Img
    style={{width: 100}}
    src={`https://picsum.photos/200`}
    loader={<div>Loading...</div>}
    unloader={<div>wont load!</div>}
  />
)

One.storyName = '正常加载';

export const Two = () => (
  <Img
    style={{width: 100}}
    src={`https://picsum.photos1/200`}
    loader={<div>Loading...</div>}
    unloader={<div>wont load!</div>}
  />
)

Two.storyName = '加载失败';