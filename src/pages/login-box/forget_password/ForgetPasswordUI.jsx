import React from "react";
import loginStyle from "../login.scss";
import {CSSTransition} from "react-transition-group";
import lineAnimation from "../lineAnimation";

export default ({
                    isDispatch,
                    pswMessage,
                    pswValidityClass,
                    password,
                    setPassWord,
                    verifyCode,
                    setVerifyCode,
                    disabled,
                    setFocus,
                    emailMessage,
                    emailValidityClass,
                    email,
                    setEmail,
                    btnClass,
                    focusClass,
                    submit
                }) => {
    return (<div className={loginStyle.form}>
        <CSSTransition in={isDispatch}
                       timeout={300} classNames="route" unmountOnExit={true} appear={true}>
            <>
                <label htmlFor="password"
                       className={pswMessage.length ? pswValidityClass : ''}
                       data-before={pswMessage}>新密码</label>
                <input type="password" id="password"
                       value={password}
                       disabled={disabled}
                       onChange={event => setPassWord(event.target.value)}
                       onFocus={() => lineAnimation(0, '240 1386', setFocus)}/>
                <label htmlFor="verify">安全码</label>
                <input type="text" id="verify"
                       value={verifyCode}
                       disabled={disabled}
                       onChange={event => setVerifyCode(event.target.value)}
                       onFocus={() => lineAnimation(-336, '240 1386', setFocus)}/>
            </>
        </CSSTransition>
        <CSSTransition in={!isDispatch}
                       timeout={300} classNames="route" unmountOnExit={true} appear={true}>
            <>
                <label htmlFor="email"
                       className={emailMessage.length ? emailValidityClass : ''}
                       data-before={emailMessage}>通过邮箱找回</label>
                <input type="email" id="email"
                       value={email}
                       disabled={disabled}
                       onChange={event => setEmail(event.target.value)}
                       onFocus={() => lineAnimation(0, '240 1386', setFocus)}/>
            </>
        </CSSTransition>
        <button type="button"
                className={`${loginStyle.submitBtn} ${btnClass} ${focusClass}`}
                disabled={disabled}
                onFocus={() => lineAnimation(-730, '530 1386', setFocus)}
                onClick={() => submit()}>
            <p>{isDispatch ? "修改密码" : "发送验证码"}</p>
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
