import {myBrowser} from "../unit/myBrowser";
const userInfo = sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : null;
const browser = myBrowser();
export default {
    isDaiLog: false, // 显示DaiLog
    userInfo: userInfo, // 用户信息
    browser: browser, // 浏览器
};
