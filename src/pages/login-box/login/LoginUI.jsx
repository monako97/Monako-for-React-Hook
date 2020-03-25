import React from "react";
import loginStyle from "../login.scss";
import {CSSTransition} from "react-transition-group";
import lineAnimation from "../lineAnimation";

export default ({
                    setShowLoginType,
                    loginType,
                    userMessage,
                    userValidityClass,
                    emailMessage,
                    emailValidityClass,
                    showLoginType,
                    setLoginType,
                    username,
                    email,
                    setUserName,
                    setEmail,
                    setFocus,
                    passWordMessage,
                    pswValidityClass,
                    password,
                    setPassWord,
                    btnClass,
                    focusClass,
                    submit,
                    disabled
                }) => {
    return (<div className={loginStyle.form}>
        {/* 需要根据登录类型使用对应的验证 */}
        {/* 点击显示登录类型 */}
        <label htmlFor="username"
               onClick={() => setShowLoginType(!showLoginType)}
               className={
                   loginType ? (userMessage.length ? userValidityClass : '') : (emailMessage.length ? emailValidityClass : '')
               }
               data-before={
                   loginType ? userMessage : emailMessage
               }>{loginType ? "用户名" : "邮箱"}
            {/* 登录方式 */}
            <CSSTransition
                in={showLoginType}
                timeout={300}
                classNames="route"
                unmountOnExit={true}
                appear={true}>
                <ul>
                    {/* 切换登录方式 */}
                    <li className={loginType ? loginStyle.active : ""}
                        onClick={() => setLoginType(true)}>用户名
                    </li>
                    <li className={loginType ? "" : loginStyle.active}
                        onClick={() => setLoginType(false)}>邮箱
                    </li>
                </ul>
            </CSSTransition>
        </label>
        <input type="text" id="username"
               value={loginType ? username : email}
               disabled={disabled}
               onChange={event => loginType ? setUserName(event.target.value) : setEmail(event.target.value)}
               onFocus={() => lineAnimation(0, '240 1386', setFocus)}/>
        <label htmlFor="password"
               className={passWordMessage.length ? pswValidityClass : ''}
               data-before={passWordMessage}>密码</label>
        <input type="password" id="password"
               value={password}
               disabled={disabled}
               onChange={event => setPassWord(event.target.value)}
               onFocus={() => lineAnimation(-336, '240 1386', setFocus)}/>
        <button type="button"
                className={`${loginStyle.submitBtn} ${btnClass} ${focusClass}`}
                disabled={disabled}
                onFocus={() => lineAnimation(-730, '530 1386', setFocus)}
                onClick={() => submit()}>
            <p>登录</p>
            <div className={loginStyle.loading}>
                <div/>
                <div/>
                <div/>
            </div>
            {/*  使用svg绘制  */}
            <svg className={loginStyle.check__mark} width='30px' height='30px' stroke='white' fill='none'>
                <polyline points='2,10 12,18 28,2'/>
            </svg>
        </button>
    </div>);
}
