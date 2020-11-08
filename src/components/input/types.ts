import React from 'react';

export type Size = 'x-large' | 'large' | 'normal' | 'small'

type Resize = 'vertical' | 'both' | 'horizontal' | 'none'

export interface InputProps {
  [key: string]: any;
  /** input 的 type */
  type?: string;
  /** 大小 */
  size?: Size;
  /** 默认值 */
  defaultValue? : string;
  /** 受控组件的 value */
  value?: string;
  /** 受控组件的 onChange */
  onChange?: Function;
  disabled?: boolean;
  placeholder?: string;
  name?: string;
  /** 原生的 resize 属性 */
  resize?: Resize;
  rows?: number;
  minrows?: number;
  maxrows?: number;
  autosize?: boolean;
  readonly?: boolean;
  required?: boolean;
  autofocus?: boolean;
  autocomplete?: string;
  /** 能够输入的字符数，原生 html 标签支持显示 */
  maxLength?: number;
  /** 是否展示 errorMessage */
  error?: boolean;
  /** 错误文案，会作为 dangerouslySetInnerHTML 的 __html */
  errorMessage?: string;
  /** 前缀 label */
  prefixLabel?: string | React.ReactNode;
  /** 前缀 icon 类型, 对应 Icon 组件的 type */
  prefixIcon?: string;
  /** 前缀元素 */
  prefix?: string | React.ReactNode;
  /** 后缀 label */
  suffixLabel?: string | React.ReactNode;
  /** 后缀 icon 类型, 对应 Icon 组件的 type */
  suffixIcon?: string;
  /** 后缀元素 */
  suffix?: string | React.ReactNode;
  /** 如果函数返回 true，或者正则 test 为 true，那么表示输入的值通过了限制 */
  restriction?: string | Function | RegExp;
  /** 限制类型，value 表示限制整个值，input 表示限制当前输入的字符 */
  restrictionType?: 'value' | 'input';
  /** 是否显示字数限制 */
  showWordLimit?: boolean;
  /** 帮助文案，会作为 dangerouslySetInnerHTML 的 __html */
  helpText?: string;
  /** 帮助的文案, 支持传入元素 */
  help?: string | React.ReactNode;
  className?: string;
  /** 当 focus 时触发 */
  onFocus?: Function;
  /** 点击时触发 */
  onClick?: Function;
  /** 是否展示 clear 按钮 */
  clearable?: boolean;
  /** 点击清除时触发 */
  onClear?: Function;
  /** 返回 true 则不清除真正的值 */
  suspendBeforeClear?: boolean | Function;
}

export interface InputState {
  currentValue: string;
  textareaCalcStyle: Partial<CSSStyleDeclaration>;
  focused: boolean;
}

export interface InputGroupProps {
  prependWidth?: number;
  prepend?: React.ReactNode;
  append?: React.ReactNode;
  children?: React.ReactNode;
}
