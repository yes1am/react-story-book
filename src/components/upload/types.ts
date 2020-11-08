import React from 'react';

export interface UploadProps {
  /** 上传文件的地址 */
  action?: string;
  /** ajax 上传文件的 name */
  name?: string;
  /** ajax 携带的 data */
  data?: object;
  /** ajax 的 headers */
  headers?: object;
  /** ajax 的 withCredentials 参数 */
  withCredentials?: boolean;
  /** 是否允许上传多个文件 */
  multiple?: boolean;
  /** 上传目录还是文件。如果为 true，则选择单个文件无效 */
  webkitdirectory?: boolean;
  /** 限制多少个文件 */
  limit?: number;
  /** 可以接受的文件类型 */
  accept?: string;
  /** 是否支持拖拽上传 */
  drag?: boolean;
  /** 最大的文件大小 kb */
  maxSize?: number;
  /** 是否自动上传 */
  autoUpload?: boolean;
  disabled?: boolean;
  /** 是否允许粘贴图片 */
  paste?: boolean;
  /** 在上传前执行的函数 */
  beforeUpload?: Function;
  onProgress?: Function;
  onSuccess?: Function;
  onError?: Function;
  /** 文件超过大小时，应该执行的函数 */
  onExceededSize?: Function;
  /** 当超过数量时，应该执行的函数 */
  onExceededLimit?: Function;
  /** 当上传的文件不符合要求时执行的函数，只在拖拽时有效。如果返回 false，则停止上传 */
  onExceededAccept?: Function;
  /** 上传的方法: 默认是 axios，可以使用 axios */
  httpRequest?: Function;
  /** 展示的 tip */
  tip?: React.ReactElement;
  className?: string;
  /** 渲染文件 list 的函数 */
  renderList?: Function;
  /** 当文件发生变化时执行的函数 */
  onFileChange?: Function;
  /** 取消文件上传时，执行的函数 */
  onCancel?: Function;
}

export interface UploadState {
  /** 是否正在上方拖拽 */
  dragover: boolean;
}
