import React, { Component } from 'react';
import classNames from 'classnames';
import Input from '../input';
import Icon from './icon';

/**
 * 小数相加，精度取最精确的参数的位数
 * @param num
 * @param ...nums
 * @returns {Number} the addition result of input numbers
 */
export function addDecimalNumber(num, ...nums) {
    if (!nums.length) {
        return num;
    }
    const numN = nums.shift();
    let m;
    let n;
    try {
        m = num.toString().split('.')[1].length;
    }
    catch (e) {
        m = 0;
    }
    try {
        n = numN.toString().split('.')[1].length;
    }
    catch (e) {
        n = 0;
    }
    const result = Number((Number(num) + Number(numN)).toFixed(Math.max(m, n)));
    return addDecimalNumber(result, ...nums);
}

const prefixClass = 'react-number-input';
class NumberInput extends Component {
    // static propTypes = {
    //   precision(props, propName, componentName) {
    //     const value = props[propName];
    //     if (!(value >= 0 && value === parseInt(value, 10))) {
    //       return new Error(
    //         `Invalid prop \`${propName}\` supplied to`
    //         + ` \`${componentName}\`. Validation failed.`,
    //       );
    //     }
    //   },
    // };
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        const currentValue = typeof props.value === 'undefined' ? props.defaultValue : props.value;
        const finalValue = this.getValueWithPrecision(currentValue);
        this.state = {
            currentValue: finalValue,
        };
        if ((props.formatter && !props.parser) || (props.parser && !props.formatter)) {
            console.warn('[UIReact warn][NumberInput]: formatter should use with parser in number input');
        }
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleClickUp = this.handleClickUp.bind(this);
        this.handleClickDown = this.handleClickDown.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if ('value' in this.props) {
            const finalValue = this.getValueWithPrecision(nextProps.value);
            this.setState({
                currentValue: finalValue,
            });
        }
    }
    handleChange(value) {
        const { parser } = this.props;
        let newValue = value;
        if (parser) {
            newValue = parser(value);
        }
        if (Number.isNaN(value)) {
            return;
        }
        this.setCurrentValue(newValue);
    }
    getRestriction() {
        const { min, precision, parser, } = this.props;
        const negativeExp = min < 0 ? '-?' : '';
        const decimalExp = precision === 0 ? '' : '\\.{0,1}';
        const regex = new RegExp(`^${negativeExp}(\\d+${decimalExp}\\d*)?$`);
        if (parser) {
            return (value) => regex.test(parser(value));
        }
        return regex;
    }
    handleFocus(event) {
        const { onFocus } = this.props;
        this.inputFocused = true;
        if (onFocus) {
            onFocus(event);
        }
    }
    getValueWithPrecision(value = '') {
        if (value === undefined) {
            return value;
        }
        const { precision, max, min } = this.props;
        // 把中间的 0 去掉, 如 0000001111 => 1111
        let finalValue = value.toString().replace(/^(-?)(0*)([1-9][\d|.]*?)/, '$1$3');
        // toFixed value when over precision or not input
        if (precision !== undefined && !!finalValue.length) {
            // over precision regular expression
            const regex = new RegExp(`^\\-?\\d*?\\.\\d{${precision + 1},}$`);
            if (!this.inputFocused || regex.test(finalValue)) {
                finalValue = Number(finalValue).toFixed(precision);
            }
        }
        if (!this.inputFocused) {
            if (Number(value) >= max) {
                finalValue = String(max);
            }
            if ((Number(value)) < min) {
                finalValue = String(min);
            }
        }
        return finalValue;
    }
    setCurrentValue(value) {
        const { onChange } = this.props;
        // remove front 0
        const finalValue = this.getValueWithPrecision(value);
        if (!('value' in this.props)) {
            this.setState({
                currentValue: finalValue,
            });
        }
        // 如果是有值的字符串，则转为数字
        let nextValue;
        if (typeof finalValue === 'number') {
            nextValue = finalValue;
        }
        else if (finalValue === undefined) {
            nextValue = undefined;
        }
        else {
            nextValue = finalValue.length ? Number(finalValue) : finalValue;
        }
        if (onChange) {
            onChange(nextValue);
        }
    }
    handleBlur(event) {
        const { onBlur } = this.props;
        this.inputFocused = false;
        if (onBlur) {
            onBlur(event);
        }
        // this.dispatch('FormItem', 'field-blur', this.value);
    }
    handleClickUp(event) {
        event.stopPropagation();
        const { disabled } = this.props;
        if (disabled) {
            return;
        }
        this.numberUp();
    }
    handleClickDown(event) {
        event.stopPropagation();
        const { disabled } = this.props;
        if (disabled) {
            return;
        }
        this.numberDown();
    }
    isControlsUpDisabled() {
        const { step, max } = this.props;
        const { currentValue } = this.state;
        return addDecimalNumber(currentValue, step) > max;
    }
    isControlsDownDisabled() {
        const { step, min } = this.props;
        const { currentValue } = this.state;
        return addDecimalNumber(currentValue, -step) < min;
    }
    numberUp() {
        const { currentValue } = this.state;
        const { step } = this.props;
        if (this.isControlsUpDisabled()) {
            return;
        }
        this.setCurrentValue(addDecimalNumber(currentValue, step));
    }
    numberDown() {
        const { currentValue } = this.state;
        const { step } = this.props;
        if (this.isControlsDownDisabled()) {
            return;
        }
        this.setCurrentValue(addDecimalNumber(currentValue, -step));
    }
    render() {
        const { size, disabled, error, suffixLabel, formatter, placeholder, precision, errorMessage, prefixLabel, prefixIcon, } = this.props;
        const { currentValue, } = this.state;
        const formatterValue = formatter ? formatter(currentValue) : currentValue;
        const computedPlaceholder = placeholder || (0).toFixed(precision);
        const restriction = this.getRestriction();
        const className = classNames({
            [`${prefixClass}--${size}`]: size,
            [`${prefixClass}--no-suffix`]: !suffixLabel,
            [prefixClass]: true,
            disabled,
            error,
        });
        const upCls = classNames(`${prefixClass}__control up`, {
            disabled: this.isControlsUpDisabled(),
        });
        const downCls = classNames(`${prefixClass}__control down`, {
            disabled: this.isControlsDownDisabled(),
        });
        return (<Input className={className} ref={this.inputRef} value={formatterValue} size={size} disabled={disabled} placeholder={computedPlaceholder} error={error} errorMessage={errorMessage} prefixLabel={prefixLabel} prefixIcon={prefixIcon} restriction={restriction} restrictionType="value" onFocus={this.handleFocus} onBlur={this.handleBlur} onChange={this.handleChange} suffix={(<>
            <div className={`${prefixClass}__controls`}>
              <div className={upCls} onClick={this.handleClickUp}>
                <Icon type="arrow-up-s"/>
              </div>
              <div className={downCls} onClick={this.handleClickDown}>
                <Icon type="arrow-down-s"/>
              </div>
            </div>
            {!!suffixLabel && (<span className="react-number-input__suffix">
                <span className="react-number-input__suffix-split"/>
                {suffixLabel}
              </span>)}
          </>)}/>);
    }
}
NumberInput.defaultProps = {
    max: Infinity,
    min: -Infinity,
    step: 1,
    defaultValue: '',
    size: 'normal',
};
export default NumberInput;