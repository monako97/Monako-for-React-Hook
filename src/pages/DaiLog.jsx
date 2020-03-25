import React, {useState, useEffect, useRef, useCallback,useContext} from "react";
import LoginBox from "./login-box/LoginBox";
import {changDaiLog} from "../store/action";
import Context from "../store/Context";
const DaiLog = () => {
    const {state, dispatch} = useContext(Context);
    const loginRef = useRef({});
    const [show,setShow] = useState(false);
    const [opacity,setOpacity] = useState(1);
    // 订阅 isDaiLog 显示隐藏
    useEffect(()=>{
        setShow(state.isDaiLog);
        setOpacity(1);
    },[state.isDaiLog]);
    // 使用 async await 等待 Promise 结束
    const close = useCallback(async ()=> {
        setOpacity(0);
        loginRef.current.InTransaction && await loginRef.current.InTransaction(200);
        dispatch(changDaiLog(false));
    },[]);
    return show ? (<div className="dai-log" onClick={()=>close()} style={{ opacity: opacity }}>
                        <LoginBox ref={loginRef}/>
                    </div>) : null;
};
export default DaiLog;