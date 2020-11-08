/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-plusplus */
import React from 'react';
import ReactDOM from 'react-dom';
import Modal from './Modal';
const destroyFns = [];
const isFunction = (func) => func && func instanceof Function;
const isPromise = (promise) => promise && isFunction(promise.then);
export default function confirm(config) {
    const div = document.createElement('div');
    document.body.appendChild(div);
    let currentConfig = Object.assign(Object.assign({}, config), { propsOnCancel: config.onCancel, propsOnConfirm: config.onConfirm, onCancel,
        onConfirm,
        close, visible: true });
    function onCancel() {
        if (isFunction(currentConfig.propsOnCancel)) {
            const res = currentConfig.propsOnCancel();
            if (isPromise(res)) {
                res.then(() => {
                    close();
                });
            }
        }
        else {
            close();
        }
    }
    function onConfirm() {
        if (isFunction(currentConfig.propsOnConfirm)) {
            const res = currentConfig.propsOnConfirm();
            if (isPromise(res)) {
                res.then(() => {
                    close();
                });
            }
        }
        else {
            close();
        }
    }
    function render(props) {
        ReactDOM.render(<Modal {...props}/>, div);
    }
    function close(...args) {
        currentConfig = Object.assign(Object.assign({}, currentConfig), { visible: false, afterClose: destroy.bind(this, ...args) });
        render(currentConfig);
    }
    function destroy() {
        const unmountResult = ReactDOM.unmountComponentAtNode(div);
        if (unmountResult && div.parentNode) {
            div.parentNode.removeChild(div);
        }
        for (let i = 0; i < destroyFns.length; i++) {
            const fn = destroyFns[i];
            if (fn === close) {
                destroyFns.splice(i, 1);
                break;
            }
        }
    }
    function update(newConfig) {
        currentConfig = Object.assign(Object.assign({}, currentConfig), newConfig);
        render(currentConfig);
    }
    render(currentConfig);
    destroyFns.push(close);
    return {
        destroy: close,
        update,
    };
}