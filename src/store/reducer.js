import {CHANGE_DAILOG, CHANGE_MARKDOWN, CHANGE_USERINFO} from "./actionTypes";
import http from "../unit/httpUnit";
export default (state, action) => {
    // reducer只接收state，不能改变state
    switch (action.type) {
        case CHANGE_DAILOG: // 显示DaiLog
            return {...state, ...{isDaiLog: action.value}};
        case CHANGE_USERINFO: // 用户信息
            sessionStorage.setItem('userInfo', JSON.stringify(action.value));
            if (action.value===null) http.post("login_out").then(() => {});
            return {...state, ...{userInfo: action.value}};
        default:
            return state;
    }
}
