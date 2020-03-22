import React from 'react'
import ReactDom from "react-dom";
import Toast from "./Toast";

const render = module.hot ? ReactDom.render : ReactDom.hydrate;
const notice = (type, content, duration = 4000, onClose) => {
    const div = document.createElement('div');
    div.className=`monako__toast ${type}`;
    document.body.appendChild(div);
    let _toastTime;
    let delDom = () => {
        ReactDom.unmountComponentAtNode(div);
        document.body.removeChild(div);
        clearTimeout(_toastTime);
        _toastTime = null;
    };
    // 当 duration 为 -1 时，显示伪不自动关闭
    if (duration !== -1) {
        _toastTime = setTimeout(delDom,duration + 300);
    } // +300 为离开动画所需要的时间
    render(<Toast callback={delDom}
                  notice={{content,type}}
                  onClose={onClose}
                  duration={duration}/>, div);
};
export default {
    info(content="Info", duration, onClose) {
        return notice('info', content, duration, onClose);
    },
    success(content = '操作成功', duration, onClose) {
        return notice('success', content, duration, onClose);
    },
    danger(content="发送错误", duration , onClose) {
        return notice('danger', content, duration, onClose);
    },
    loading(content = 'Loading...', duration, onClose) {
        return notice('loading', content, duration, onClose);
    },
    warning(content = '警告', duration, onClose) {
        return notice('warning', content, duration, onClose);
    },
    primary(content = 'OK', duration, onClose) {
        return notice('primary', content, duration, onClose);
    }
}
