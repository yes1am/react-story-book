import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '.';

export default {
  title: '组件/Avatar',
  component: Avatar,
  argTypes: {
  },
}

export const One = () => <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />;
One.storyName = '图片';

export const Two = () => <Avatar>J</Avatar>;
Two.storyName = '文字';