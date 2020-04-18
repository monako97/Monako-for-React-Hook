import axios from 'axios';
import Toast from "../modules/Toast/controller";
import ReactDom from "react-dom";

/**
 * @param option { method, path, data || params }
 * 使用方法
 * http(option)
 * .then(response => response)
 * .catch(error => error);
 **/
let num = 0;

// 创建实例
const http = axios.create({
    baseURL: `https://${document.domain}/monako_api/`,
    headers: {
        "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8', // 未POST请求时，数据未做处理时会出现错误，解决方法就是 直接设置该项
        'X-Requested-With': 'XMLHttpRequest', // 标识这是一个 ajax 请求
    },
    retry: 2,
    timeout: 20000,
    withCredentials: true, // 允许跨域携带cookie
    maxContentLength: 20000 // 定义允许的响应内容的最大尺寸
});
// 请求前
http.interceptors.request.use(
    config => {
        // 请求时出现加载遮罩层，hidLoading 不显示加载
        if (!document.getElementsByClassName("monako__toast loading").length&&!config.hidLoading) Toast.loading("loading",-1);
        num++;
        // 请求前
        return config;
    },
    err => Promise.reject(err)
);
// // 接收后
http.interceptors.response.use(
    response => {
        resultUntil();
        return response;
    },
    error => {
        resultUntil();
        if(error.code === 'ECONNABORTED' && error.message.indexOf('timeout')!==-1 && !error.config._retry){
            Toast.danger("请求超时");
            error.config._retry = true;
            return http.request(error.config);
        } else if (error.response === undefined) {
            let msg = error.message;
            if (error.message === "Network Error") msg = "网络连接失败";
            Toast.danger(msg,2000,true);
        }
        return error.response;
    }
);
let resultUntil = () => {
    num--;
    if (num <= 0) {
        // 删除遮罩层
        let _loading = document.getElementsByClassName("monako__toast loading");
        if(_loading && _loading.length) {
            ReactDom.unmountComponentAtNode(_loading[0]);
            document.body.removeChild(_loading[0]);
        }
    }
};
export default http;
