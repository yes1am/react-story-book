export type Size = 'small' | 'normal' | 'medium' | 'large' | 'x-large';

export interface ModalProps {
  /** 是否显示 cancel button */
  showCancel?: boolean;
  /** 是否显示 confirm button */
  showConfirm?: boolean;
  /** 是否显示 close icon */
  showClose?: boolean;
  /** 默认 modal 挂载 body 下面，使用此函数自定义挂载的 dom */
  getPopupContainer?: () => HTMLElement;
  /** modal 是否显示 */
  visible?: boolean;
  /** 在 modal open 之后应该执行的函数 */
  afterOpen?: Function;
  /** 在 modal close 之后应该执行的函数 */
  afterClose?: Function;
  /** cancel 按钮是否 disabled */
  isCancelDisabled?: boolean;
  /** cancel 按钮是否 loading */
  isCancelLoading?: boolean;
  /** confirm 按钮是否 disabled */
  isConfirmDisabled?: boolean;
  /** confirm 按钮是否 loading */
  isConfirmLoading?: boolean;
  /** 点击 confirm 按钮时执行的函数 */
  onConfirm?: Function;
  /** 点击 cancel 按钮时执行的函数 */
  onCancel?: Function;
  /** 点击 close 按钮时，是否触发 onClose 事件 */
  emitClose?: boolean;
  /** 点击 close 按钮时，执行的回调(前提是 emitClose 为 true) */
  onClose?: Function;
  /** 点击 mask 时，是否要关闭 modal */
  closeOnClickMask?: boolean;
  /** modal 的 body 内容 */
  content?: React.ReactNode;
  /** 定义 modal 按钮左边的内容 */
  footerAssist?: React.ReactNode;
  /** 通过该属性完全覆盖 Modal 的内容 */
  contentSlot?: React.ReactNode;
  /** modal 的尺寸 'small' | 'normal' | 'medium' | 'large' | 'x-large'; */
  size?: Size;
  /** 是否居中显示 */
  center?: boolean;
  /** modal 标题 */
  title?: string;
  /** modal 副标题 */
  subtitle?: string;
}
