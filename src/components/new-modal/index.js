import confirm from './confirm';
import Modal from './Modal';

Modal.alarm = function alarmFn(props) {
  const config = {
    showCancel: false,
    ...props,
  };
  return confirm(config);
};

Modal.confirm = function confirmFn(props) {
  const config = {
    ...props,
  };
  return confirm(config);
};

export default Modal;
