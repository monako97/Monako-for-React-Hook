import React from "react";
import loginStyle from "../login.scss";
import lineAnimation from "../lineAnimation";

export default ({
                    userMessage,
                    userValidityClass,
                    username,
                    setUserName,
                    setFocus,
                    passWordMessage,
                    pswValidityClass,
                    password,
                    disabled,
                    setPassWord,
                    btnClass,
                    focusClass,
                    submit,
                    step,
                    emailMessage,
                    emailValidityClass,
                    email,
                    setEmail
                }) => {
    return (<div className={loginStyle.form}>
        {
            step===1 ? <>
                <label htmlFor="username"
                       className={userMessage.length ? userValidityClass : ''}
                       data-before={userMessage}>用户名
                    <input type="text" id="username"
                           value={username}
                           disabled={disabled}
                           onChange={event => setUserName(event.target.value)}
                           onFocus={() => lineAnimation(0, '240 1386', setFocus)}/>
                </label>
                <label htmlFor="password"
                       className={passWordMessage.length ? pswValidityClass : ''}
                       data-before={passWordMessage}>密码
                    <input type="password" id="password"
                           value={password}
                           disabled={disabled}
                           onChange={event => setPassWord(event.target.value)}
                           onFocus={() => lineAnimation(-336, '240 1386', setFocus)}/>
                </label>
            </> : <label htmlFor="username"
                         className={emailMessage.length ? emailValidityClass : ''}
                         data-before={emailMessage}>邮箱
                <input type="email" id="email"
                       value={email}
                       disabled={disabled}
                       onChange={event => setEmail(event.target.value)}
                       onFocus={() => lineAnimation(0, '240 1386', setFocus)}/>
            </label>
        }
        <button type="button"
                className={`${loginStyle.submitBtn} ${btnClass} ${focusClass}`}
                disabled={disabled}
                onFocus={() => lineAnimation(-730, '530 1386', setFocus)}
                onClick={() => submit()}>
            <p>{step===1?"下一步":"注册"}</p>
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
