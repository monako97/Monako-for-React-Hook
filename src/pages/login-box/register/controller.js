import {useState, useEffect} from "react";
import loginStyle from "../../../style/login.scss";
import {RULES_EMAIL, RULES_PASSWORD, RULES_USERNAME} from "../../../rules/rules";
import lineAnimation from "../lineAnimation";
import http from "../../../unit/httpUnit";
import RSAEncrypt from "../../../unit/RSAEncrypt";
import Toast from "../../../modules/Toast/controller";

export default ({InTransaction, OutTransaction}) => {
    // 用户名验证
    const [userMessage, setUserMessage] = useState("");
    const [userValidityClass, setUserValidityClass] = useState("");
    // 密码验证
    const [passWordMessage, setPassWordMessage] = useState("");
    const [pswValidityClass, setPswValidityClass] = useState("");
    const [focusClass, setFocusClass] = useState("");
    const [btnClass, setBtnClass] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [username, setUserName] = useState("");
    const [password, setPassWord] = useState("");
    // 步骤
    const [step, setStep] = useState(1);
    // 邮箱
    const [email, setEmail] = useState("");
    // 邮箱验证信息
    const [emailMessage,setEmailMessage] =useState("");
    // 验证邮箱是否通过
    const [emailValidityClass,setEmailValidityClass] = useState("");
    // 线条位置
    const [focus, setFocus] = useState(0);
    // 监听线条位置
    useEffect(() => {
        focus === -730 ? setFocusClass(loginStyle.changLogin) : setFocusClass("");
    }, [focus]);
    // 验证用户名合法
    useEffect(() => {
        if (RULES_USERNAME.test(username)) {
            setUserValidityClass(loginStyle.ok);
        } else {
            if (username.length < 4) setUserMessage("用户名至少4个字符");
            else if (username.length > 10) setUserMessage("用户名最多10个字符");
            else setUserMessage("必须字母开头");
            setUserValidityClass(loginStyle.err);
        }
    }, [username]);
    // 验证密码合法
    useEffect(() => {
        if (RULES_PASSWORD.test(password)) {
            setPswValidityClass(loginStyle.ok);
        } else {
            if (password.length < 6) setPassWordMessage("密码至少6个字符");
            else if (password.length > 16) setPassWordMessage("密码最多16个字符");
            else setPassWordMessage("只能输入字母、数字、下划线");
            setPswValidityClass(loginStyle.err);
        }
        if (RULES_EMAIL.test(email)){
            setEmailValidityClass(loginStyle.ok);
        } else {
            setEmailMessage("邮箱不合法");
            setEmailValidityClass(loginStyle.err);
        }
    }, [password,email]);

    // 提交
    const submit = () => {
        if (userValidityClass === loginStyle.ok && pswValidityClass === loginStyle.ok){
            if (step===1) {
                setStep(2);
            } else if (emailValidityClass === loginStyle.ok){
                setDisabled(true);
                setBtnClass(loginStyle.active);
                // 事务开始动画
                InTransaction();
                lineAnimation(-700, '0 1386', setFocus);
                http.request({
                    url: 'register',
                    method: "POST",
                    data: {
                        username: RSAEncrypt(username),
                        password: RSAEncrypt(password),
                        email: RSAEncrypt(email),
                        phone: RSAEncrypt(""),
                        address: RSAEncrypt(""),
                        birthday: RSAEncrypt("1999-01-20 00:00:00")
                    }
                }).then(response => {
                    if (response.status === 200) {
                        // 注册成功
                        setBtnClass(`${loginStyle.active} ${loginStyle.verity}`);
                        Toast.success(response.data.message);
                    } else {
                        setStep(1);
                        // 请求失败
                        setDisabled(false);
                        // 事务结束动画
                        OutTransaction();
                        setBtnClass("error");
                        if (response.status !== undefined) Toast.danger(response.data.message);
                    }
                });
            }
        }
    };

    return {
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
    };
}
