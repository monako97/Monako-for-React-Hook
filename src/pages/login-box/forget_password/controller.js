import {useCallback, useState, useEffect} from "react";
import loginStyle from "../../../style/login.scss";
import {RULES_EMAIL, RULES_PASSWORD} from "../../../rules/rules";
import lineAnimation from "../lineAnimation";
import http from "../../../unit/httpUnit";
import Toast from "../../../modules/Toast/controller";
import RSAEncrypt from "../../../unit/RSAEncrypt";

export default ({InTransaction, OutTransaction}) => {
    // 邮箱验证信息
    const [emailMessage, setEmailMessage] = useState("");
    // 验证邮箱是否通过
    const [emailValidityClass, setEmailValidityClass] = useState("");
    // 密码验证信息
    const [pswMessage, setPswMessage] = useState("");
    // 验证密码是否通过
    const [pswValidityClass, setPswValidityClass] = useState("");
    // 验证码是否已发送
    const [isDispatch, setIsDispatch] = useState(false);
    // 是否聚焦到提交按钮：如果是，则改变按钮颜色已对应线条颜色
    const [focusClass, setFocusClass] = useState("");
    // 提交按钮状态
    const [btnClass, setBtnClass] = useState("");
    // 是否禁止点击：请求中时禁止
    const [disabled, setDisabled] = useState(false);
    // 邮箱：使用邮箱找回密码
    const [email, setEmail] = useState("");
    // 新密码
    const [password, setPassWord] = useState("");
    // 安全码
    const [verifyCode, setVerifyCode] = useState("");
    // 线条位置
    const [focus, setFocus] = useState(0);
    // 监听线条位置
    useEffect(() => {
        focus === -730 ? setFocusClass(loginStyle.changLogin) : setFocusClass("");
    }, [focus]);
    // 验证邮箱合法性
    useEffect(() => {
        // 当登录方式为邮箱时
        if (RULES_EMAIL.test(email)) {
            setEmailValidityClass(loginStyle.ok);
        } else {
            setEmailMessage("邮箱不合法");
            setEmailValidityClass(loginStyle.err);
        }
    }, [email]);
    // 验证密码合法性
    useEffect(() => {
        // 当登录方式为邮箱时
        if (RULES_PASSWORD.test(password)) {
            setPswValidityClass(loginStyle.ok);
        } else {
            if (password.length < 6) setPswMessage("密码至少6个字符");
            else if (password.length > 16) setPswMessage("密码最多16个字符");
            else setPswMessage("只能输入字母、数字、下划线");
            setPswValidityClass(loginStyle.err);
        }
    }, [password]);
    const forgetPassword = useCallback((encrypt, url) => {
        setDisabled(true);
        setBtnClass(loginStyle.active);
        // 事务开始动画
        InTransaction();
        lineAnimation(-700, '0 1386', setFocus);
        http.post(url, encrypt).then(response => {
            if (response.status === 200) {
                // 切换到修改密码
                if (!isDispatch) {
                    setDisabled(false);
                    setIsDispatch(true);
                    setBtnClass("");
                    lineAnimation(0, '240 1386', setFocus);
                } else {
                    setBtnClass(`${loginStyle.active} ${loginStyle.verity}`);
                }
                Toast.success(response.data.message);
            } else {
                // 请求失败
                setDisabled(false);
                // 事务结束动画
                OutTransaction();
                setBtnClass("error");
                // 验证码失效，重新获取
                if (response.status === 412) setIsDispatch(false);
                if (response.status !== undefined) Toast.danger(response.data.message);
            }
        });
    }, [isDispatch]);
    // 发送验证码到邮箱
    const submit = () => {
        if (emailValidityClass === loginStyle.ok) {
            if (!isDispatch) { // 发送验证码
                let encrypt = RSAEncrypt(JSON.stringify({email: email}));
                if (encrypt) forgetPassword(encrypt, "forget_pwd_verify_code"); // 如果加密失败会返回false
                else Toast.warning("邮箱填写错误，请检查您的邮箱");
            } else { // 修改密码
                let encrypt = RSAEncrypt(JSON.stringify({
                    email: email,
                    password: password,
                    verify_code: verifyCode
                }));
                if (encrypt) forgetPassword(encrypt, "forget_password"); // 如果加密失败会返回false
                else Toast.warning("信息填写有误，请检查");
            }
        }
    };
    return {
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
    };
}
