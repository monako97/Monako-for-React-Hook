import React, {useState, useEffect,useContext} from "react";
import { useHistory } from "react-router";
import headerStyle from "../style/header-bar.scss";
import {changDaiLog, changeUserInfo} from "../store/action";
import Avatar from "./Avatar";
import Context from "../store/Context";
import SocketUnit from "../unit/SocketUnit";
export default function HeaderBar() {
    new SocketUnit();
    const history = useHistory();
    const {state, dispatch} = useContext(Context);
    // 声明一个叫 “count” 的 state 变量。
    const [nav, setNav] = useState([]);
    const [open, setOpen] = useState(false); // 打开nav菜单
    // userInfo发生更新的时候执行
    useEffect(()=>{
        // 当用户数据存在时，更新菜单，取消登录按钮
        if (state.userInfo) setNav([
            { name: '首页', to: '/home' },
            { name: '分类', to: '/class' },
            { name: '时间轴', to: '/timeLine' },
            { name: '登出', to: "/login-box", component: 'login-box' }
        ]);
        else setNav([
            { name: '首页', to: '/home' },
            { name: '分类', to: '/class' },
            { name: '时间轴', to: '/timeLine' },
            { name: '登录', to: "/login-box", component: 'login-box' }
        ]);
    },[state.userInfo]);
    // 点击菜单的事件
    const navTap = e => {
        // 当 component 字段存在时，为登录，开启 dailog
        if (e.component) {
            if (!state.userInfo) dispatch(changDaiLog(true)); // 登陆
            else dispatch(changeUserInfo(null)); // 登出
        } else {
            history.push({
                pathname: e.to
            });
            document.body.scrollTop = 0;
        }
    };
    return (<>
        <header className={headerStyle.header}>
            <h1>
                <a onClick={() => navTap({to: '/home'})}>Monako</a>
            </h1>
            {/* nav菜单 */}
            <svg className={`${headerStyle['ham']} ${open?headerStyle['active']:''}`} viewBox="0 0 100 100" width="50" onClick={() => setOpen(!open)}>
                <path className={`${headerStyle['line']} ${headerStyle['top']}`}
                      d="m 30,33 h 40 c 3.722839,0 7.5,3.126468 7.5,8.578427 0,5.451959 -2.727029,8.421573 -7.5,8.421573 h -20" />
                <path className={`${headerStyle['line']} ${headerStyle['middle']}`} d="m 30,50 h 40" />
                <path className={`${headerStyle['line']} ${headerStyle['bottom']}`}
                      d="m 70,67 h -40 c 0,0 -7.5,-0.802118 -7.5,-8.365747 0,-7.563629 7.5,-8.634253 7.5,-8.634253 h 20" />
            </svg>
            <nav className={headerStyle['nav']}>
                {
                    nav.map(e => {
                        // component 字段不存在，则使用路由按钮
                        return <a key={e.name} onClick={() => navTap(e)}>{e.name}</a>
                    })
                }
            </nav>
            {/* 头像：用户数据不存在时，url为空 */}
            <Avatar imgSrc={state.userInfo?state.userInfo.avatar:null}/>
        </header>
    </>);
}
