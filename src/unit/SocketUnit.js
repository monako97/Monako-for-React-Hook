import React, {useState, useCallback, useEffect} from "react";
import Context from "../store/Context";
import Toast from "../modules/Toast/controller";
import {changeUserInfo} from "../store/action";

const socketUnit = () => {
    const url = `${document.domain}:8080/monako_api/websocket`;
    // 心跳计时器
    const [heartTimer, setHeartTimer] = useState(null);
    // 心跳时间 5s
    const heartBeatTime = 5000;
    // 心跳信息
    const [heartMsg, setHearMsg] = useState("hello");
    // 心跳状态
    let alive = false;
    // 重连计时器
    const [reConnectTimer, setReConnectTimer] = useState(null);
    // 是否自动重连
    const [reConnect, setReConnect] = useState(true);
    // 重连间隔时间
    const reConnectTime = 5000;
    // 重连次数
    const [reConnectCount, setReConnectCount] = useState(5);
    const { state, dispatch } = React.useContext(Context);

    // socket实例
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        init();
        return ()=>{
            // 清除计时器
            if (heartTimer) {
                clearInterval(heartTimer);
                setHeartTimer(null);
            }
            if (reConnectTimer) {
                clearInterval(reConnectTimer);
                setReConnectTimer(null);
            }
        }
    },[]);
    useEffect(() => {
        if (socket) func();
    },[socket]);
    const init = useCallback(() => {
        console.log("初始化: WebSocket"+reConnectCount);
        if (typeof (WebSocket) == "undefined") {
            Toast.danger("您的浏览器不支持WebSocket");
        } else {
            try{
                setSocket(new WebSocket(`ws://${url}`));
                // switch (state.browser) {
                //     case "Safari":
                //     case "Chrome":
                //         setSocket(new WebSocket(`ws://${url}`));
                //         break;
                //     case "Firefox":
                //         setSocket(new MozWebSocket(`wss://${url}`));
                //         break;
                //     case "Opera":
                //         break;
                //     case "IE":
                //     case "Edge":
                //         setSocket(new SockJS(`http://${url}`));
                //         break;
                // }
            }catch (e) {

            }
        }
    },[reConnectCount]);
    const func = useCallback(()=>{
        // 清除计时器
        if (heartTimer) clearInterval(heartTimer);
        if (reConnectTimer) clearInterval(reConnectTimer);
        // 开启
        socket.onopen = () => {
            //设置状态为开启
            alive = true;
            // 取消重连
            if (reConnectTimer) clearInterval(reConnectTimer);
            //连接后进入心跳状态
            onHeartBeat();
        };
        // 获得消息
        socket.onmessage = msg => {
            try {
                let info = JSON.parse(msg.data);
                console.log(info);
                switch (info.type) {
                    case "userInfo":
                        Toast.primary(info.message);
                        if (info.data) dispatch(changeUserInfo(info.data));
                        break;
                    case "init":
                        Toast.primary(info.message);
                        break;
                    case "loginOut":
                        Toast.primary(info.message);
                        // 登录失效，清除用户信息
                        dispatch(changeUserInfo(null));
                        break;
                    default:
                        break;
                }
            } catch (e) { }
        };
        // 关闭
        socket.onclose = () => {
            //设置状态为断开
            alive = false;
            if (heartTimer) clearInterval(heartTimer);
            //自动重连开启  +  不在重连状态下
            /* 断开后立刻重连 */
            if (reConnect) onReConnect();
        };
        // 发生了错误
        socket.onerror = () => {
            console.log("Socket发生了错误");
        };
        // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = () => socket.close();
    },[socket,reConnect,heartTimer,reConnectTimer]);
    /* 心跳事件 */
    const onHeartBeat = useCallback(()=>{
        //在连接状态下
        if (alive) {
            /* 心跳计时器 */
            setHeartTimer(setInterval(()=>{
                //发送心跳信息
                // socket.send(heartMsg);
            },heartBeatTime));
        }
    },[socket,heartMsg,heartBeatTime]);
    /* 重连事件 */
    const onReConnect = useCallback(()=>{
        /* 重连间隔计时器 */
        setReConnectTimer(setInterval(()=>{
            //限制重连次数
            if (reConnectCount <= 0) {
                // 关闭自动重连
                setReConnect(false);
                // 关闭定时器
                clearInterval(reConnectTimer);
                setReConnectTimer(null);
                //跳出函数之间的循环
                return;
            }else{
                //重连一次-1
                setReConnectCount(reConnectCount-1);
            }
            //进入初始状态
            init();
        }, reConnectTime));
    },[reConnectTime,reConnectTimer,reConnectCount,reConnect]);
};

export default socketUnit;