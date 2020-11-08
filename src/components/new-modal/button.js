import React from 'react';

export default function (props) {
  return <div className="button" onClick={props.onClick}>{props.children}</div>
}