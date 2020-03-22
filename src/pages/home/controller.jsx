import React, {useState, useEffect, useCallback} from "react";
import {useHistory} from "react-router";
import http from "../../unit/httpUnit";
import HomeCardUI from "./HomeCardUI";
export default () => {
    const history = useHistory();
    // 列表
    const [list, setList] = useState([]);
    // 到底
    const [isEnd, setIsEnd] = useState(false);
    // 页码
    const [page, setPage] = useState(1);
    // 总数
    const [totalSize, setTotalSize] = useState(0);
    // 列表高度
    const [rowHeight, setRowHeight] = useState(419);
    // 查看 markdown
    const handleClick = useCallback(data => {
        history.push({
            pathname: `/detail/${data.id}`
        });
    }, []);
    // 动态获取列表高度
    const _rowHeight = useCallback(() => {
        if (innerWidth > 880) setRowHeight(567);
        else if (innerWidth > 700) setRowHeight(547);
        else if (innerWidth > 580) setRowHeight(517);
        else setRowHeight(419);
    }, []);
    // 首次加载
    useEffect(() => {
        document.title = "首页";
        moreList();
        _rowHeight();
        window.addEventListener("resize", _rowHeight);
        return () => window.removeEventListener("resize", _rowHeight);
    }, []);
    // 是否已经滚动到底部
    const onRowsRendered = useCallback(({stopIndex}) => {
        if (!isEnd && stopIndex > list.length - 2 && totalSize > list.length) {
            // 页数 + 1
            setPage(page + 1);
            // 标记为到底部
            setIsEnd(true);
            // 加载更多数据
            moreList();
        }
    }, [totalSize, list, isEnd]);
    // 加载更多数据
    const moreList = useCallback(() => {
        http.request({
            url: 'markdown_list',
            method: "POST",
            data: {
                currentPage: page
            }
        }).then(response => {
            if (response.status === 200) {
                // 使用了ES6中的扩展运算符(...)拷贝已存在的项到新的数组，并且把新项插入到最后
                setList([
                    ...list,
                    ...response.data.list
                ]);
                setTotalSize(response.data.totalSize);
                // 标记为未到底部
                setIsEnd(false);
            } else {
                // 失败
            }
        });
    }, [page]);
    // 完成加载的
    const isRowLoaded = useCallback(({index}) => {
        return !!list[index];
    }, [list]);


    // 渲染列表
    const rowRenderer = React.useCallback(({key, index, style}) => {
        return (<HomeCardUI key={key} index={index} style={style} list={list} handleClick={handleClick} />);
    }, [list]);
    return {list, isRowLoaded, onRowsRendered, rowHeight, rowRenderer};
}
