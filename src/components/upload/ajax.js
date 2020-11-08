// https://github.com/ElemeFE/element/blob/dev/packages/upload/src/ajax.js
function getError(action, option, xhr) {
  let msg;
  if (xhr.response) {
      msg = `${xhr.response.error || xhr.response}`;
  }
  else if (xhr.responseText) {
      msg = `${xhr.responseText}`;
  }
  else {
      msg = `fail to post ${action} ${xhr.status}`;
  }
  const err = new Error(msg);
  err.status = xhr.status;
  err.method = 'post';
  err.url = action;
  return err;
}
function getBody(xhr) {
  const text = xhr.responseText || xhr.response;
  if (!text) {
      return text;
  }
  try {
      return JSON.parse(text);
  }
  catch (e) {
      return text;
  }
}
function upload(option) {
  if (typeof XMLHttpRequest === 'undefined') {
      return;
  }
  const xhr = new XMLHttpRequest();
  const { action } = option;
  if (xhr.upload) {
      xhr.upload.onprogress = function progress(e) {
          if (e.total > 0) {
              e.percent = (e.loaded / e.total) * 100;
          }
          option.onProgress(e);
      };
  }
  const formData = new FormData();
  if (option.data) {
      Object.keys(option.data).forEach((key) => {
          formData.append(key, option.data[key]);
      });
  }
  formData.append(option.filename, option.file, option.file.name);
  xhr.onerror = function error(e) {
      option.onError(e);
  };
  xhr.onload = function onload() {
      if (xhr.status < 200 || xhr.status >= 300) {
          return option.onError(getError(action, option, xhr));
      }
      option.onSuccess(getBody(xhr));
  };
  xhr.onabort = function onabort() {
      console.log('已取消');
  };
  xhr.open('post', action, true);
  if (option.withCredentials && 'withCredentials' in xhr) {
      xhr.withCredentials = true;
  }
  const headers = option.headers || {};
  Object.keys(headers).forEach((key) => {
      const item = headers[key];
      if (item !== null) {
          xhr.setRequestHeader(key, item);
      }
  });
  xhr.send(formData);
  return xhr;
}
export default upload;