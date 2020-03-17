import React, { useState, useCallback,useEffect, useContext} from "react";
import commentStyle from "../style/commentStyle.scss";
import MarkdownEdit from "./MarkdownEdit";
import {changDaiLog} from "../store/action";
import {markdownParser} from "../unit/markdownParser";
import LikePoi from "./LikePoi";
import http from "../unit/httpUnit";
import dateFormat from "../unit/dateFormat";
import Toast from "../modules/Toast/controller";
import Context from "../store/Context";
import Avatar from "./Avatar";
const Comment = ({id}) => {
    const {state, dispatch} = useContext(Context);
    // 评论列表
    const [commentList,setCommentList] = useState([]);
    // 当前页
    const [currentPage,setCurrentPage] = useState(0);
    // 总评论数
    const [totalSize,setTotalSize] = useState(0);
    // 总页数
    const [totalPage,setTotalPage] = useState(0);

    // 分页查询评论
    const findComment = useCallback(() => {
        http.post("markdown_comment",{
            currentPage: currentPage+1,
            markdown_id: id
        }).then(response => {
            if (response.status === 200){
                if (Array.isArray(response.data.list) && response.data.list.length){
                    setTotalSize(response.data.totalSize);
                    setCurrentPage(response.data.currentPage);
                    setTotalPage(response.data.totalPage);
                    setCommentList([
                        ...commentList,
                        ...response.data.list
                    ]);
                }
            }else{
                Toast.danger(response.data.message,3000,true);
            }
        });
    },[currentPage,commentList]);
    // 首次加载
    useEffect(()=>{
        findComment();
    },[]);
    // 加载更多
    const more = useCallback(() => {
        findComment();
    },[currentPage,commentList]);
    // 提交评论
    const onPushComment = useCallback(async (info) =>{
        let status = false;
        // 输入内容不为空并且用户登录时
        if (info.trim().length && state.userInfo) await http.post("add_comment",{
            markdown_id: id,
            info: info
        }).then(response => {
            if (response.status === 200){
                // 使用了ES6中的扩展运算符(...)拷贝已存在的项到新的数组，并且把新项插入到最后
                setCommentList([
                    {
                        id: null,
                        info: info,
                        create_time: new Date().getTime(),
                        like: '',
                        like_count: 0,
                        username: state.userInfo.username,
                        user_id: state.userInfo.id,
                        avatar: state.userInfo.avatar
                    },
                    ...commentList
                ]);
                Toast.success("提交成功",3000,true);
                status = true;
            }else{
                Toast.danger(response.data.message,3000,true);
                status = false;
            }
        });
        else Toast.danger("请输入有效的内容！",3000,true);
        return status;
    },[commentList]);
    // 点赞
    const onLike = useCallback((like,comment_id) => {
        if (state.userInfo) http.post("likes_comment",{
            id: comment_id // 评论id
        }).then(response => {
            if (response.status !== 200) Toast.danger(response.data.message,3000,true);
        });
        else Toast.danger("未登录",3000,true);
    },[commentList]);
    return <>
        <div className={commentStyle.comment}>
            <h4 className={commentStyle.comment_header}>
                <span className={commentStyle.count}>{totalSize}</span>条评论
                <div className={commentStyle.avatar}>
                    { /* 如果没有用户信息，则说明需要登录用户，显示登录框 */
                        state.userInfo ? <Avatar imgSrc={state.userInfo.avatar} /> :
                            <p onClick={() => dispatch(changDaiLog(true))}>未登录</p>
                    }
                </div>
            </h4>
            {/* 编辑区 */}
            <MarkdownEdit user={state.userInfo} callback={onPushComment}/>
            <hr />
            {/* 展示区 */}
            {
                commentList.map((item,i) => {
                    return (
                        <div key={i} className={commentStyle.comment_list}>
                            <div className={commentStyle.avatar}>
                                <Avatar imgSrc={item.avatar} />
                                <p>{item.username}</p>
                            </div>
                            <div className={commentStyle.comment_context}>
                                {/* 内容 */}
                                <div className={commentStyle.comment_info}
                                     dangerouslySetInnerHTML={{__html: markdownParser.render(item.info)}}/>
                                {/* 点赞回复栏 */}
                                <div className={commentStyle.comment_tool}>
                                    <time>{dateFormat(item.create_time,"Y年m月d日 H时i分")}</time>
                                    <div>
                                        {/* item.like : 1,2,3,4 表示点赞人的ID */}
                                        {/* 用户未登录时显示为 false */}
                                        <LikePoi callback={onLike} like={
                                            state.userInfo ?
                                                (item.likes?
                                                    item.likes.split(",").indexOf(String(state.userInfo.id))!==-1
                                                    :false)
                                                :false}
                                                 count={item.likes_count}
                                                 id={item.id}/>
                                        <span>回复</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
            {
                totalPage > currentPage ?
                    <div className={commentStyle.page_tool_bar}
                         onClick={() => more()}>加载更多...</div> :
                    <div className={commentStyle.page_tool_bar}>没有了...</div>
            }
        </div>
    </>
};
export default Comment;
