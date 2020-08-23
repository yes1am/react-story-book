import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '.';

export default {
  title: '组件/Tooltip',
  component: null,
  argTypes: {
  },
}


export const One = () => (
  <div style={{padding: 100}}>
    <div style={{display: 'flex'}}>
      <div style={{margin: '0 50px'}}>
        <Tooltip position="left" title={4561111111111111111}>
          左对齐
        </Tooltip>
      </div>
      <div style={{margin: '0 50px'}}>
        <Tooltip position="left" title={122}>
          左对齐
        </Tooltip>
      </div>
      <div style={{margin: '0 50px'}}>
        <Tooltip position="center" title={4561111111111111111}>
          居中对齐
        </Tooltip>
      </div>
      <div style={{margin: '0 50px'}}>
        <Tooltip position="center" title={122}>
          居中对齐
        </Tooltip>
      </div>
      <div style={{margin: '0 50px'}}>
        <Tooltip position="right" title={4561111111111111111}>
          右对齐
        </Tooltip>
      </div>
      <div style={{margin: '0 50px'}}>
        <Tooltip position="right" title={122}>
          右对齐
        </Tooltip>
      </div>
    </div>
  </div>
)

One.storyName = 'Tooltip';
