import React, {useState, useMemo, useEffect,Suspense} from "react";
import {useParams} from "react-router-dom";
import Toast from "../modules/Toast/controller";
import http from "../unit/httpUnit";
import {markdownParser} from "../unit/markdownParser";
import "../style/markdown-view.scss";
const Comment = React.lazy(() => import(/* webpackChunkName: "Comment" */ "./Comment")); // 评论组件

const MarkdownView = () => {
    const params = useParams();
    const [opacity,setOpacity] = useState(0);
    const [markdown,setMarkdown] = useState(markdownParser.render('# 正在拼命加载文档...'));
    const [state, setState] = useState(null);
    useMemo(() => {
        // 获取文档信息
        http.post("find_markdown",{id: parseInt(params.id)}).then(response => {
            if (response && response.status === 200) setState(response.data.result);
            else Toast.danger(response.data.message);
            document.title = response.data.result.title;
        });
    },[]);
    useEffect(() => {
        if (state){
            // 判断背景图片加载完成
            let img = new Image();
            img.src = state.image;
            img.onload = img.onerror = () => {
                img.remove();
                img = null;
                let _time = setTimeout(() => {
                    clearTimeout(_time);
                    _time = null;
                    setOpacity(0.1);
                },500);
            };
            http.request({
                method: "GET",
                url: `http://${document.domain + ":" + window.location.port}/markdown/${state.title}.md`,
                responseType: "blob"
            }).then(response => {
                if (response && response.status === 200){
                    // 将二进制文件读取为字符串
                    let reader = new FileReader();
                    reader.onload = () => {
                        setMarkdown(markdownParser.render(reader.result));
                        reader = null;
                    };
                    reader.onerror = () => {
                        setMarkdown(markdownParser.render('# 文档加载失败！'));
                        reader = null;
                    };
                    reader.readAsText(response.data);
                }else{
                    setMarkdown(markdownParser.render('# 文件不存在'));
                }
            });
        }
    },[state]);
    return (<>
        <main className="detail-container">
            <img className="bg-blur" src={state?state.image:null} alt="" style={{ opacity: opacity }}/>
            {/*加载完成后显示md文档*/}
            <article dangerouslySetInnerHTML={{ __html: markdown }}/>
            {/* 评论组件 */}
            <Suspense fallback={null}>
                <Comment id={parseInt(params.id)}/>
            </Suspense>
        </main>
    </>);
};
export default MarkdownView;
