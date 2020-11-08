/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import classNames from 'classnames';
import InputGroup from './InputGroup';
import Icon from './icon';
import calcTextareaHeight from './calculate-textarea-height';
const RESTRICTION_TYPE = {
    VALUE: 'value',
    INPUT: 'input',
};
const PREFIX_CLASS = 'react-input';

import './input.less'
import './input-group.less'

/**
 * whether the object is a Regular Expression
 * @param {Object} object the given object
 * @return {Boolean}
 */
export function isRegExp(object) {
  return object && toString.call(object) === '[object RegExp]';
}

// remove below props when using v-bind at native input
const REMOVE_PROPS = [
    'error',
    'errorMessage',
    'prefixLabel',
    'prefixIcon',
    'suffixLabel',
    'suffixIcon',
    'restriction',
    'value',
    'defaultValue',
    'showWordLimit',
    'helpText',
    'autosize',
    'onChange',
    'clearable',
    'onFoucs',
    'onBlur',
    'className',
    'suffix',
];
class Input extends Component {
    constructor(props) {
        super(props);
        this.resizeTextarea = () => {
            const { autosize, type, minrows, maxrows } = this.props;
            if (type !== 'textarea') {
                return;
            }
            if (!autosize) {
                this.setState({
                    textareaCalcStyle: {
                        minHeight: calcTextareaHeight(this.textareaRef.current, minrows, maxrows).minHeight,
                    },
                });
                return;
            }
            this.setState({
                textareaCalcStyle: calcTextareaHeight(this.textareaRef.current, minrows, maxrows),
            });
        };
        this.restrictionTest = (value) => {
            const { restriction } = this.props;
            if (typeof restriction === 'function') {
                return restriction(value);
            }
            if (isRegExp(restriction)) {
                return restriction.test(value);
            }
            if (restriction === 'number') {
                return /^\d*$/.test(value);
            }
            return true;
        };
        this.handleClick = () => {
            const { onClick } = this.props;
            if (onClick) {
                onClick();
            }
        };
        this.handleFocus = () => {
            const { onFocus } = this.props;
            this.setState({
                focused: true,
            });
            if (onFocus) {
                onFocus();
            }
        };
        this.handleBlur = () => {
            const { onBlur } = this.props;
            this.setState({
                focused: false,
            });
            if (onBlur) {
                onBlur();
            }
        };
        this.handleChange = (event) => {
            const { restriction, restrictionType } = this.props;
            const { currentValue } = this.state;
            if (restriction) {
                const isRestrictInput = restrictionType === RESTRICTION_TYPE.INPUT;
                const value = isRestrictInput ? event.nativeEvent.data : event.target.value;
                // 如果没通过检测，就不会改变值
                if ((!isRestrictInput || value) && !this.restrictionTest(value)) {
                    this.inputRef.current.value = currentValue;
                    return;
                }
            }
            this.setCurrentValue(event.target.value);
        };
        this.setCurrentValue = (value) => {
            const { onChange } = this.props;
            const { currentValue } = this.state;
            if (value !== currentValue) {
                if (!('value' in this.props)) {
                    this.setState({
                        currentValue: value,
                    });
                }
                if (onChange) {
                    onChange(value);
                }
            }
            this.forceUpdate(() => {
                this.resizeTextarea();
            });
        };
        /**
         * 默认在clearable状态下点击X会清空value，若为true则不清空
         */
        this.suspendBeforeClearTest = () => {
            const { suspendBeforeClear } = this.props;
            if (typeof suspendBeforeClear === 'function') {
                return suspendBeforeClear();
            }
            if (typeof suspendBeforeClear === 'boolean') {
                return suspendBeforeClear;
            }
            return false;
        };
        this.clear = () => {
            const { onClear } = this.props;
            if (!this.suspendBeforeClearTest()) {
                this.setCurrentValue('');
            }
            if (onClear) {
                onClear();
            }
        };
        this.getNativeProps = () => {
            const props = {};
            Object.keys(this.props).forEach((key) => {
                if (key === 'restrictionType') {
                    // eslint-disable-next-line no-param-reassign
                    key = key.toLowerCase();
                }
                if (!REMOVE_PROPS.includes(key)) {
                    // eslint-disable-next-line react/destructuring-assignment
                    const value = this.props[key];
                    props[key] = typeof value === 'object' ? (Object.assign({}, value)) : value;
                }
            });
            return props;
        };
        const currentValue = typeof props.value === 'undefined' ? props.defaultValue : props.value;
        this.state = {
            currentValue,
            textareaCalcStyle: {},
            focused: false,
        };
        this.inputRef = React.createRef();
        this.textareaRef = React.createRef();
    }
    componentDidMount() {
        this.resizeTextarea();
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if ('value' in this.props) {
            this.setState({
                currentValue: nextProps.value,
            });
        }
    }
    getClassName() {
        const { size, disabled, error, clearable } = this.props;
        const { focused, currentValue } = this.state;
        const className = classNames(`${PREFIX_CLASS}__inner`, [`${PREFIX_CLASS}__inner--${size || 'normal'}`], {
            focused,
            disabled,
            error,
            'active-clearable': clearable && !!currentValue.length,
        });
        return className;
    }
    /** 渲染 help */
    renderHelp() {
        const { help, helpText } = this.props;
        const isRenderHelpText = helpText && !help;
        return (<>
        {isRenderHelpText && (<p className="react-input__help-text" dangerouslySetInnerHTML={{ __html: helpText }}/>)}
        {help && <div className="react-input__help-text">{help}</div>}
      </>);
    }
    /** 渲染 error */
    renderError() {
        const { error, errorMessage } = this.props;
        return error
            ? (<p className="react-input__error-msg" dangerouslySetInnerHTML={{ __html: errorMessage }}/>)
            : null;
    }
    /** 渲染 limit */
    renderWordLimit() {
        const { currentValue } = this.state;
        const textLength = currentValue.length;
        const { showWordLimit, maxLength, type, disabled } = this.props;
        const isWordLimitVisible = showWordLimit && maxLength && !disabled && ['text', 'textarea'].includes(type);
        return isWordLimitVisible ? (<span className="react-input__count">
        {`${textLength}/${maxLength}`}
      </span>) : null;
    }
    renderTextarea() {
        const { resize } = this.props;
        const { textareaCalcStyle, currentValue } = this.state;
        const textareaStyle = Object.assign(Object.assign({}, textareaCalcStyle), { resize });
        const className = this.getClassName();
        return (<div className="react-input react-input__area" onClick={this.handleClick}>
        <textarea ref={this.textareaRef} className={className} style={textareaStyle} value={currentValue} onFocus={this.handleFocus} onBlur={this.handleBlur} onChange={this.handleChange} {...this.getNativeProps()}/>
        {this.renderWordLimit()}
        {this.renderError()}
        {this.renderHelp()}
      </div>);
    }
    /** 渲染 input 前缀 */
    renderInputPrefix() {
        const { prefixLabel, prefixIcon, prefix } = this.props;
        const hasPrefix = prefixLabel || prefixIcon || prefix;
        return hasPrefix ? (<div className="react-input__prefix">
        {!!prefixLabel && (<>
            {prefixLabel}
            <span className="react-input__prefix-split"/>
          </>)}
        {prefixIcon && <Icon className="react-input__prefix-icon" type={prefixIcon}/>}
        {prefix}
      </div>) : null;
    }
    /** 渲染 input 后缀 */
    renderInputSuffix() {
        const { suffix, suffixLabel, suffixIcon, clearable, showWordLimit, maxLength, type, disabled, } = this.props;
        const isWordLimitVisible = showWordLimit && maxLength && ['text', 'textarea'].includes(type) && !disabled;
        const hasSuffix = suffix || suffixLabel || suffixIcon || clearable || isWordLimitVisible;
        return hasSuffix ? (<div className="react-input__suffix">
        {clearable && (<span onClick={this.clear}>
            <Icon className="react-input__clear-btn" type="round-close-s"/>
          </span>)}
        {suffixLabel && (<>
            <span className="react-input__suffix-split"/>
            {suffixLabel}
          </>)}
        {!suffixLabel && this.renderWordLimit()}
        {suffixIcon && <Icon className="react-input__suffix-icon" type={suffixIcon}/>}
        {suffix}
      </div>) : null;
    }
    renderInput() {
        const { className: propsClassName, type, } = this.props;
        const className = this.getClassName();
        const { currentValue } = this.state;
        return (<div className={classNames('react-input', propsClassName)} onClick={this.handleClick}>
        <div className={className}>
          {this.renderInputPrefix()}
          <input className="react-input__input" ref={this.inputRef} type={type} value={currentValue} {...this.getNativeProps()} onFocus={this.handleFocus} onBlur={this.handleBlur} onChange={this.handleChange}/>
          {this.renderInputSuffix()}
        </div>
        {this.renderError()}
        {this.renderHelp()}
      </div>);
    }
    render() {
        const { type } = this.props;
        const component = type === 'textarea' ? this.renderTextarea() : this.renderInput();
        return component;
    }
}
Input.defaultProps = {
    type: 'text',
    resize: 'vertical',
    defaultValue: '',
    rows: 2,
    minrows: 2,
    restrictionType: RESTRICTION_TYPE.INPUT,
};
Input.Group = InputGroup;
export default Input;