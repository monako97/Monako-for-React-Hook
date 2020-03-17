import {CHANGE_DAILOG, CHANGE_USERINFO} from "./actionTypes";
export const changDaiLog = value => ({
    type: CHANGE_DAILOG,
    value
});
export const changeUserInfo = value => ({
    type: CHANGE_USERINFO,
    value
});
