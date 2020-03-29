import React, {useState, useCallback, useContext} from "react";
import Editor from 'for-editor';
import markdownEditStyle from "./markDownEditStyle.scss";
import BubblyButton from "../../modules/BubblyButton/BubblyButton";
import {changDaiLog} from "../../store/action";
import http from "../../unit/httpUnit";
import Toast from "../../modules/Toast/controller";
import Context from "../../store/Context";
import {ProgressBar} from "../../modules/ProgressBar/ProgressBar";
import {CSSTransition} from "react-transition-group";
const equal = (prevProps, nextProps) => {
    return prevProps.user === nextProps.user;
};
const MarkdownEdit = ({callback}) => {
    const {state, dispatch} = useContext(Context);
    // 输入内容
    const [info,setInfo] = useState("");
    // 最大输入长度
    const [count,setCount] = useState(500);
    // 输入内容改变时
    const handleInfo = useCallback(value => {
        if (count > 0 || 500 - value.length > 0) {
            setInfo(value);
            setCount(500 - value.length);
        }
    },[count, info]);
    // 显示进度条
    const [showProgress, setShowProgress] = useState(false);
    // 上传进度
    const [progress, setProgress] = useState(0);
    // 上传图片
    const addImg = useCallback(file => {
        let param = new FormData();
        //通过append向form对象添加数据
        param.append("file", file);
        http.post("upload_img",param,{
            headers: {
                "Content-Type": "multipart/form-data"
            },
            hidLoading: true, // 不显示loading
            timeout: 60000, // 超时时间修改为1分钟
            onUploadProgress: progressEvent => { //原生获取上传进度的事件
                if(progressEvent.lengthComputable){
                    setShowProgress(true);
                    //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
                    //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
                    setProgress(Math.floor(progressEvent.loaded / progressEvent.total * 100));
                }
            }
        }).then(response=>{
            if (response.status===200){
                setInfo(info+`\n![alt](${response.data.result})`);
                Toast.success("上传成功",3000,true);
            }else {
                Toast.danger(response.data.message,2000,true);
            }
        }).finally(()=>{
            // 关闭进度条
            setShowProgress(false);
            setProgress(0);
        });
    },[info]);
    // 提交信息
    const submit = useCallback(() => {
        if (state.userInfo){
            // 用户登录时
            callback(info).then(status => {
                // 当提交成功时返回 true
                if (status) setInfo("");
            });
        }else {
            // 用户未登录时
            dispatch(changDaiLog(true));
        }
    },[info,callback]);
    // 保存
    const save = useCallback(value => {
        console.log("save",value);
    },[]);
    return (<>
        <CSSTransition
            in={showProgress}
            timeout={200}
            classNames="route"
            unmountOnExit={true}
            appear={true}>
            <ProgressBar progress={progress}/>
        </CSSTransition>
        <Editor value={info}
                placeholder="支持 markdown 语法"
                lineNum={false}
                height={"auto"}
                style={{
                    padding: "0 10px 10px 10px",
                    maxWidth: "1000px",
                    margin: "10px auto 0",
                    borderRadius: "10px",
                    minHeight: "80px",
                    width: "calc(100% - 20px)",
                    backgroundColor: "transparent",
                    transition: "width 0.3s, height 0.3s, background 0.3s"
                }}
                onChange={event => handleInfo(event)}
                addImg={file => addImg(file)}
                onSave={value => save(value)}
                toolbar={
                    {
                        h1: false, // h1
                        h2: false, // h2
                        h3: false, // h3
                        h4: true, // h4
                        img: !!state.userInfo, // 图片
                        link: true, // 链接
                        code: true, // 代码块
                        preview: false, // 预览
                        expand: true, // 全屏
                        /* v0.0.9 */
                        undo: true, // 撤销
                        redo: true, // 重做
                        save: false, // 保存
                        /* v0.2.3 */
                        subfield: true, // 单双栏模式
                    }
                }/>
        <p className={markdownEditStyle.info}>
            最多还能输入{count}字!
            <BubblyButton callback={submit} text={state.userInfo?"Submit":"Login"} />
        </p>

    </>);
};
export default MarkdownEdit;
