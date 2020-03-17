import http from 'axios';
import Toast from "../modules/Toast/controller";
import {changeUserInfo} from "../store/action";
import React from "react";
import Context from "../store/Context";
/**
 * @param option { method, path, data || params }
 * 使用方法
 * http(option)
 * .then(response => response)
 * .catch(error => error);
 **/
let num = 0;
http.defaults.baseURL = `http://${document.domain}/monako_api/`;
// http.defaults.baseURL = `http://${document.domain}:8080/monako_api/`;
http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
http.defaults.retry = 0;
// http.defaults.crossDomain = true;
http.defaults.withCredentials = true; //允许跨域携带cookie
http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';//标识这是一个 ajax 请求
// http.defaults.retryDelay = 1000;
http.defaults.timeout = 20000;
// 请求前
http.interceptors.request.use(
    config => {
        // let token = "";
        // if (token) config.headers.token = `${token}`;
        // 请求时出现加载遮罩层
        if (!document.getElementsByClassName("monako__toast loading").length) Toast.loading("loading",-1);
        num++;
        // 请求前
        return config;
    },
    err => Promise.reject(err)
);
// 接收后
http.interceptors.response.use(
    response => {
        resultUntil();
        if (response.status === 302) {
            const {dispatch} = React.useContext(Context);
            // // 登录失效，清除用户信息
            dispatch(changeUserInfo(null));
        }
        return response;
    },
    error => {
        resultUntil();
        if(error.code === 'ECONNABORTED' && error.message.indexOf('timeout')!==-1 && !error.config._retry){
            Toast.danger("请求超时");
            error.config._retry = true;
            return http.request(error.config);
        }else if (error.response === undefined) {
            let msg = error.message;
            if (error.message === "Network Error") msg = "网络连接失败";
            Toast.danger(msg,2000,true);
            return error.config;
        } else {
            return error.response;
        }
    }
);
let resultUntil = () => {
    num--;
    if (num <= 0) {
        // 删除遮罩层
        let _loading = document.getElementsByClassName("monako__toast loading");
        if(_loading !== null) document.body.removeChild(_loading[0]);
    }
};
export default http;
