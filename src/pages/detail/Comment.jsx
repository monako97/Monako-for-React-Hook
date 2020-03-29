import React, { useState, useCallback,useMemo, useContext} from "react";
import commentStyle from "./commentStyle.scss";
import MarkdownEdit from "./MarkdownEdit";
import {changDaiLog} from "../../store/action";
import {markdownParser} from "../../unit/markdownParser";
import LikePoi from "../../modules/LikePoint/LikePoi";
import http from "../../unit/httpUnit";
import dateFormat from "../../unit/dateFormat";
import Toast from "../../modules/Toast/controller";
import Context from "../../store/Context";
import Avatar from "../../modules/Avatar/Avatar";
import {CSSTransition, TransitionGroup} from "react-transition-group";

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
    // 回复框显示的位置，对应评论的ID
    const [showComment, setShowComment] = useState(null);
    // 评论对象，即对谁评论
    const [commentUser, setCommentUser] = useState(null);
    // 需要全部显示的评论楼层
    const [showMore, setShowMore] = useState([]);
    // 首次加载
    useMemo(()=>{
        findComment();
    },[]);
    // 加载更多
    const more = useCallback(() => {
        if (totalPage > currentPage) findComment();
    },[currentPage,commentList]);
    // 提交评论
    const onPushComment = useCallback(async (info, pid) =>{
        if (!pid){
            setShowComment(null);
            setCommentUser(null);
        }
        let status = false;
        // 输入内容不为空并且用户登录时
        if (info.trim().length && state.userInfo) await http.post("add_comment",{
            markdown_id: id, // 文档id
            info: info,  // 回复信息
            comment_id: showComment, // 评论id
            comment_user: commentUser, // 评论对象
            parent_id: pid // 父级ID
        }).then(response => {
            if (response && response.status === 200){
                // 使用了ES6中的扩展运算符(...)拷贝已存在的项到新的数组，并且把新项插入到最后
                if (pid){
                    let a = commentList.find(item => item.id === pid);
                    a.child.push({
                        id: response.data.result,
                        info: info,
                        create_time: new Date().getTime(),
                        like: '',
                        likes_count: 0,
                        username: state.userInfo.username,
                        user_id: state.userInfo.id,
                        avatar: state.userInfo.avatar,
                        comment_user: commentUser,
                        comment_id: showComment,
                        parent_id: pid,
                        child: []
                    });
                    setCommentList([...commentList]);
                } else {
                    setCommentList(
                        [{
                            id: response.data.result,
                            info: info,
                            create_time: new Date().getTime(),
                            like: '',
                            likes_count: 0,
                            username: state.userInfo.username,
                            user_id: state.userInfo.id,
                            avatar: state.userInfo.avatar,
                            comment_user: commentUser,
                            comment_id: showComment,
                            parent_id: 0,
                            child: []
                        },...commentList]
                    );
                }
                Toast.success(response.data.message,3000,true);
                status = true;
            }else{
                if (response) Toast.danger(response.data.message,3000,true);
                status = false;
            }
        });
        else Toast.danger("请输入有效的内容！",3000,true);
        return status;
    },[commentList, state.userInfo,showComment,commentUser]);
    // 点赞
    const onLike = useCallback(async comment_id => {
        let like = false;
        if (state.userInfo) await http.post("likes_comment",{
            id: comment_id // 评论id
        }).then(response => {
            if (response){
                if (response.status !== 200) Toast.danger(response.data.message,3000,true);
                else like = true;
            }
        });
        else Toast.danger("未登录",3000,true);
        return like;
    },[commentList, state.userInfo]);
    // 显示回复框
    const toggleComment = useCallback((value, user) => {
        if (showComment === value) {
            setShowComment(null);
            setCommentUser(null);
        } else {
            setShowComment(value);
            setCommentUser(user);
        }
    },[showComment]);
    return (<>
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
            <MarkdownEdit callback={onPushComment}/>
            <hr />
            {/* 展示区 */}
            <TransitionGroup component={null} appear={true}>
                {
                    commentList.map((item,i) => {
                        {/* item.like : 1,2,3,4 表示点赞人的ID */}
                        {/* 用户未登录时显示为 false */}
                        const _like = state.userInfo && item.likes && item.likes.split(",").indexOf(String(state.userInfo.id))!==-1;
                        {/* 评论内容 */}
                        const _html = markdownParser.render(item.info);
                        const _child = item.child ?? [];
                        return (
                            <CSSTransition
                                key={i}
                                timeout={300}
                                classNames="route"
                                appear={true}>
                                <div key={i} className={commentStyle.comment_list}>
                                    <div className={commentStyle.avatar}>
                                        <Avatar imgSrc={item.avatar} />
                                        <p>{item.username}</p>
                                    </div>
                                    <div className={commentStyle.comment_context}>
                                        <div className={commentStyle.comment_info} dangerouslySetInnerHTML={{ __html: _html }}/>
                                        {/* 点赞回复栏 */}
                                        <div className={`${commentStyle.comment_tool} ${commentStyle.parent}`}>
                                            <time>{dateFormat(item.create_time,"Y年m月d日 H时i分")}</time>
                                            <div>
                                                <LikePoi callback={onLike}
                                                         like={_like}
                                                         count={item.likes_count}
                                                         id={item.id}/>
                                                <span onClick={() => toggleComment(item.id, item.username)}>
                                                    {showComment === item.id ? "收起" : "回复"}
                                                </span>
                                            </div>
                                        </div>
                                        {/* 回复框 */}
                                        { showComment === item.id ? <MarkdownEdit callback={info => onPushComment(info, item.id)}/> : null }
                                        {/* 楼中楼 */}
                                        <TransitionGroup component={null}>
                                            {
                                                _child.map((child, s) => {
                                                    const child_like = state.userInfo && child.likes && child.likes.split(",").indexOf(String(state.userInfo.id))!==-1;
                                                    {/* 评论内容 */}
                                                    const child_html = markdownParser.render(child.info);
                                                    if (showMore.indexOf(item.id) === -1){
                                                        if (s === 3) return (<CSSTransition
                                                            key={s}
                                                            timeout={300}
                                                            classNames="route"
                                                            appear={true}>
                                                            <div className={commentStyle.page_tool_bar} onClick={()=>{
                                                                console.log(showMore);
                                                                setShowMore([...showMore,item.id]);

                                                            }}>显示剩余的{_child.length - 3}条回复</div>
                                                        </CSSTransition>);
                                                        if (s > 3) return null;
                                                    }
                                                    return (<CSSTransition
                                                        key={s}
                                                        timeout={300}
                                                        classNames="route"
                                                        appear={true}>
                                                        <div className={commentStyle.comment_list}>
                                                            <div className={commentStyle.avatar}>
                                                                <Avatar imgSrc={child.avatar} />
                                                                <p>{child.username}</p>
                                                            </div>
                                                            <div className={commentStyle.comment_context}>
                                                                <div className={commentStyle.comment_info} username={child.username} comment_user={`回复 ${child.comment_user}：`} dangerouslySetInnerHTML={{ __html: child_html }}/>
                                                                {/* 点赞回复栏 */}
                                                                <div className={commentStyle.comment_tool}>
                                                                    <time>{dateFormat(child.create_time,"Y年m月d日 H时i分")}</time>
                                                                    <div>
                                                                        <LikePoi callback={onLike}
                                                                                 like={child_like}
                                                                                 count={child.likes_count}
                                                                                 id={child.id}/>
                                                                        <span onClick={() => toggleComment(child.id, child.username)}>
                                                                    {showComment === child.id ?"收起":"回复"}
                                                                </span>
                                                                    </div>
                                                                </div>
                                                                {/* 回复框 */}
                                                                { showComment === child.id ? <MarkdownEdit callback={info => onPushComment(info, item.id)}/> : null }
                                                            </div>
                                                        </div>
                                                    </CSSTransition>);
                                                })
                                            }
                                        </TransitionGroup>
                                    </div>
                                </div>
                            </CSSTransition>
                        )
                    })
                }
            </TransitionGroup>
            {/* More */}
            <div className={commentStyle.page_tool_bar}
                 onClick={() => more()}>
                { totalPage > currentPage ? "加载更多..." : "没有了..." }
            </div>
        </div>
    </>);
};
export default React.memo(Comment);
