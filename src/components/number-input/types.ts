import { Size } from '../input/types';

export interface NumberInputProps {
  defaultValue?: number | string;
  value?: number | string;
  placeholder?: string;
  // size of input: x-large, large, normal, small
  size?: Size;
  max?: number;
  min?: number;
  step: number;
  suffixLabel?: string;
  prefixLabel?: string;
  prefixIcon?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  formatter?: Function;
  parser?: Function;
  /** 精度，精确到几位 */
  precision?: number;
  onFocus?: Function;
  onBlur?: Function;
  onChange?: Function;
}

export interface NumberInputState {
  currentValue: number | string;
}
