import React, {useState, useCallback, useContext} from "react";
import Editor from 'for-editor';
import markdownEditStyle from "../style/markDownEditStyle.scss";
import BubblyButton from "./BubblyButton";
import {changDaiLog} from "../store/action";
import http from "../unit/httpUnit";
import Toast from "../modules/Toast/controller";
import Context from "../store/Context";
const MarkdownEdit = ({user,callback}) => {
    const {dispatch} = useContext(Context);
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
    },[count]);
    // 上传图片
    const addImg = useCallback(file => {
        let param = new FormData();
        //通过append向form对象添加数据
        param.append("file", file);
        http.post("upload_img",param,{
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then(response=>{
            if (response.status===200){
                setInfo(info+`\n![alt](${response.data.result})`);
                Toast.success("上传成功",3000,true);
            }else {
                Toast.danger(response.data.message,2000,true);
            }
        });
    },[info]);
    // 提交信息
    const submit = useCallback(() => {
        if (user){
            // 用户登录时
            callback(info).then(status => {
                // 当提交成功时返回 true
                if (status) setInfo("");
            });
        }else {
            // 用户未登录时
            dispatch(changDaiLog(true));
        }
    },[info,user,callback]);
    // 保存
    const save = useCallback(value => {
        console.log("save",value);
    },[]);
    return <>
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
                        img: true, // 图片
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
            最多输入{count}字!
            <BubblyButton callback={() => submit()} text={user?"Submit":"Login"} />
        </p>
    </>
};
export default MarkdownEdit;
