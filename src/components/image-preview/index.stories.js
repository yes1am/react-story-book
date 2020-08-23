import React from 'react';
import PropTypes from 'prop-types';
import ImagePreview from '.';

import a from '../../assets/images/a.jpg';
import b from '../../assets/images/b.jpg';
import c from '../../assets/images/c.png';
import d from '../../assets/images/d.png';

export default {
  title: '组件/Image-Preview',
  component: ImagePreview,
  argTypes: {
  },
}

export const One = () => <ImagePreview src={a} />;
One.storyName = '宽高大于屏幕宽高';

export const Two = () => <ImagePreview src={b} />;
Two.storyName = '宽高小于屏幕宽高';

export const Three = () => <ImagePreview src={c} />;
Three.storyName = '高小于屏幕高';

export const Four = () => <ImagePreview src={d} />;
Four.storyName = '宽大于屏幕宽';