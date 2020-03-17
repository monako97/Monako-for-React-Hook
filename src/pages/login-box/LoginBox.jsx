import React, {useState, useCallback, useEffect,useContext, useImperativeHandle, forwardRef, Suspense} from "react";
import {CSSTransition} from "react-transition-group";
import loginStyle from "../../style/login.scss";
import Context from "../../store/Context";
import lineAnimation from "./lineAnimation";
const Login = React.lazy(() => import(/* webpackChunkName: "Login" */ "./login/Login"));
const Register = React.lazy(() => import(/* webpackChunkName: "Register" */ "./register/Register"));
const ForgetPassword = React.lazy(() => import(/* webpackChunkName: "ForgetPassword" */ "./forget_password/ForgetPassword"));

const LoginBox = (props, ref) => {
    const {state} = useContext(Context);
    const [nav] = useState([
        {name: "登录", path: "Login"},
        {name: "注册", path: "Register"},
        {name: "忘记密码", path: "ForgetPassword"},
    ]);
    const [loginFormStyle, setLoginFormStyle] = useState({});
    const [active, setActive] = useState('Login');
    // 事务开始动画
    const InTransaction = useCallback(timeout => new Promise(resolve => {
        // 传递了 timeout 时为关闭，透明度改为0
        if (document.body.offsetWidth > 767) setLoginFormStyle({
            width: state.userInfo ? '320px' : '350px',
            opacity: timeout ? 0 : 1
        });
        else setLoginFormStyle({
            height: state.userInfo ? '320px' : '350px',
            opacity: timeout ? 0 : 1
        });
        let s = setTimeout(()=>{
            clearTimeout(s);
            s = null;
            resolve();
        },timeout);
    }),[]);
    // 事务结束动画
    const OutTransaction = useCallback(() => {
        if (document.body.offsetWidth > 767) setLoginFormStyle({width: '610px'});
        else setLoginFormStyle({height: '560px'});
    },[]);
    // 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
    useImperativeHandle(ref, () => ({
        // InTransaction 就是暴露给父组件的方法
        InTransaction,
    }),[InTransaction]);
    useEffect(()=>{
        lineAnimation(0,'240 1386');
    },[active]);
    useEffect(()=>{
        // 当没有用户登录时才执行张开动画
        if (!state.userInfo) OutTransaction();
    },[]);
    return <div className={loginStyle.login} onClick={event=>event.stopPropagation()}>
        <div className={loginStyle.container} style={loginFormStyle}>
            {/* 没有用户登录信息时显示控制面板 */}
            <CSSTransition in={ !state.userInfo }
                           timeout={300} classNames="route" unmountOnExit={true} appear={true}>
                <div className={loginStyle.left}>
                    { nav.map(item =>
                        <div key={item.path}
                             className={active===item.path ? loginStyle.select_text : loginStyle.eula}
                             onClick={() => setActive(item.path)}>
                            {item.name}
                        </div>
                    ) }
                </div>
            </CSSTransition>
            <div className={loginStyle.right}>
                <svg viewBox="0 0 320 300">
                    <defs>
                        <linearGradient
                            id="linearGradient"
                            x1="13"
                            y1="193.49992"
                            x2="307"
                            y2="193.49992"
                            gradientUnits="userSpaceOnUse">
                            <stop style={{
                                "stopColor": "#81a6e0"
                            }} offset="0" id="stop876" />
                            <stop style={{
                                "stopColor": "#cc7bc5"
                            }} offset="1" id="stop878" />
                        </linearGradient>
                    </defs>
                    <path id="ling" d="m 40,120.00016 239.99984,-3.2e-4 c 0,0 24.99263,0.79932 25.00016,35.00016 0.008,34.20084 -25.00016,35 -25.00016,35 h -239.99984 c 0,-0.0205 -25,4.01348 -25,38.5 0,34.48652 25,38.5 25,38.5 h 215 c 0,0 20,-0.99604 20,-25 0,-24.00396 -20,-25 -20,-25 h -190 c 0,0 -20,1.71033 -20,25 0,24.00396 20,25 20,25 h 168.57143" />
                </svg>
                <Suspense fallback={null}>
                    {/* 登录 */}
                    <CSSTransition in={active === "Login"}
                                   timeout={300} classNames="route" unmountOnExit={true} appear={true}>
                        <Login InTransaction={InTransaction} OutTransaction={OutTransaction}/>
                    </CSSTransition>
                </Suspense>
                <Suspense fallback={null}>
                    {/* 注册 */}
                    <CSSTransition in={active === "Register"}
                                   timeout={300} classNames="route" unmountOnExit={true} appear={true}>
                        <Register InTransaction={InTransaction} OutTransaction={OutTransaction}/>
                    </CSSTransition>
                </Suspense>
                <Suspense fallback={null}>
                    {/* 忘记密码 */}
                    <CSSTransition in={active === "ForgetPassword"}
                                   timeout={300} classNames="route" unmountOnExit={true} appear={true}>
                        <ForgetPassword InTransaction={InTransaction} OutTransaction={OutTransaction}/>
                    </CSSTransition>
                </Suspense>

            </div>
        </div>
    </div>
};
export default forwardRef(LoginBox);
