import React from 'react';
const InputGroup = (props) => {
    const { prependWidth = 120, prepend, append, children, } = props;
    return (<div className="react-input-group">
      <span className="react-input-group__prepend" style={{ width: `${prependWidth}px` }}>
        {prepend}
      </span>
      <span className="react-input-group__append">
        {append}
      </span>
      {(!prepend && !append) && children}
    </div>);
};
export default InputGroup;