import {useCallback,useState,useMemo,useContext} from "react";
import Context from "../../../store/Context";
import loginStyle from "../../../style/login.scss";
import {RULES_EMAIL, RULES_PASSWORD, RULES_USERNAME} from "../../../rules/rules";
import lineAnimation from "../lineAnimation";
import http from "../../../unit/httpUnit";
import {changeUserInfo} from "../../../store/action";
import Toast from "../../../modules/Toast/controller";
import RSAEncrypt from "../../../unit/RSAEncrypt";

export default ({InTransaction,OutTransaction}) => {
    const {dispatch} = useContext(Context);
    // 用户名验证信息
    const [userMessage,setUserMessage] = useState("");
    // 验证用户名是否通过
    const [userValidityClass,setUserValidityClass] = useState("");
    // 密码验证信息
    const [passWordMessage,setPassWordMessage] =useState("");
    // 验证密码是否通过
    const [pswValidityClass,setPswValidityClass] = useState("");
    // 邮箱验证信息
    const [emailMessage,setEmailMessage] =useState("");
    // 验证邮箱是否通过
    const [emailValidityClass,setEmailValidityClass] = useState("");
    // 是否聚焦到登录按钮：如果是，则改变按钮颜色已对应线条颜色
    const [focusClass, setFocusClass] = useState("");
    // 登录按钮状态
    const [btnClass, setBtnClass] = useState("");
    // 是否禁止点击：请求中时禁止
    const [disabled, setDisabled] = useState(false);
    // 用户名：当使用用户名登录时使用
    const [username, setUserName] = useState("");
    // 邮箱：当使用邮箱登录时使用
    const [email, setEmail] = useState("");
    // 密码
    const [password, setPassWord] = useState("");
    // 显示切换登录类型
    const [showLoginType, setShowLoginType] = useState(false);
    // 当前登录类型：true：用户名登录 false：邮箱登录
    const [loginType, setLoginType] = useState(true);
    // 线条位置
    const [focus, setFocus] = useState(0);

    // 监听线条位置
    useMemo(()=>{
        focus === -730 ? setFocusClass(loginStyle.changLogin) : setFocusClass("");
    },[focus]);
    // 验证用户名合法
    useMemo(()=>{
        // 当登录方式为用户名登录时
        if (loginType){
            if (RULES_USERNAME.test(username)){
                setUserValidityClass(loginStyle.ok);
            }else {
                if (username.length < 4) setUserMessage("用户名至少4个字符");
                else if (username.length > 10) setUserMessage("用户名最多10个字符");
                else setUserMessage("必须字母开头");
                setUserValidityClass(loginStyle.err);
            }
        } else {
            // 当登录方式为邮箱时
            if (RULES_EMAIL.test(email)){
                setEmailValidityClass(loginStyle.ok);
            } else {
                setEmailMessage("邮箱不合法");
                setEmailValidityClass(loginStyle.err);
            }
        }
    },[username,email,loginType]);
    // 验证密码合法
    useMemo(()=>{
        if (RULES_PASSWORD.test(password)) {
            setPswValidityClass(loginStyle.ok);
        }else {
            if (password.length < 6) setPassWordMessage("密码至少6个字符");
            else if (password.length > 16) setPassWordMessage("密码最多16个字符");
            else setPassWordMessage("只能输入字母、数字、下划线");
            setPswValidityClass(loginStyle.err);
        }
    },[password]);

    const login = useCallback((encrypt,url) => {
        setDisabled(true);
        setBtnClass(loginStyle.active);
        // 事务开始动画
        InTransaction();
        lineAnimation(-700,'0 1386', setFocus);
        http.post(url, encrypt).then(response => {
            if (response.status === 200){
                // 登录成功
                setBtnClass(`${loginStyle.active} ${loginStyle.verity}`);
                // 缓存用户信息
                dispatch(changeUserInfo(response.data.result));
                switch (response.data.result.status) {
                    case 0:
                    case 2:
                        Toast.warning(`登录成功：用户${response.data.result.comment}`);
                        break;
                    case 1:
                        Toast.success("登录成功");
                        break;
                    case 3:
                        Toast.danger(`用户${response.data.result.comment}`);
                        break;
                }
            } else {
                // 请求失败
                setDisabled(false);
                // 事务结束动画
                OutTransaction();
                setBtnClass("error");
                if (response.status !== undefined) Toast.danger(response.data.message);
            }
        });
    },[loginType]);
    // 提交登录
    const submit = () => {
        if (loginType) {
            // 使用用户名登录
            if (userValidityClass===loginStyle.ok&&pswValidityClass===loginStyle.ok){
                // 加密登录数据
                let encrypt = RSAEncrypt(JSON.stringify({
                    username: username,
                    password: password
                }));
                if (encrypt) login(encrypt,"login_by_username"); // 如果加密失败会返回false
                else Toast.warning("信息填写错误，请检查您的用户名和密码");
            }
        } else {
            // 使用邮箱登录
            if (emailValidityClass===loginStyle.ok&&pswValidityClass===loginStyle.ok){
                // 加密登录数据
                let encrypt = RSAEncrypt(JSON.stringify({
                    email: email,
                    password: password
                }));
                if (encrypt) login(encrypt,"login_by_email"); // 如果加密失败会返回false
                else Toast.warning("信息填写错误，请检查您的邮箱和密码");
            }
        }

    };
    return {
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
    };
}
