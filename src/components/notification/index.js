import React from 'react';
import Notification from './notification';

let notificationInstance = null;
let defaultGetContainer;

function getNotificationInstance(
  {
    getContainer,
  },
  callback: Function
) {

  if (notificationInstance) {
    callback(notificationInstance);
    return;
  }

  Notification.newInstance(
    {
      getContainer,
    },
    (notification) => {
      notificationInstance = notification;
      callback(notification);
    },
  );
}


function notice(args) {
  const { getContainer = defaultGetContainer } = args;
  getNotificationInstance(
    {
      getContainer
    },
    (notification: any) => {
      notification.notice({
        content: <div>{args.message}</div>,
      });
    },
  );
}

const api = {
  open: notice,
  config: (options) => {
    const { getContainer } = options;
    if (getContainer !== undefined) {
      defaultGetContainer = getContainer;
    }
  },
  destroy() {
    notificationInstance = null;
  },
};

export default api;
