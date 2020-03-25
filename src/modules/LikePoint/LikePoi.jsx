import React,{useState,useCallback,useEffect} from "react";
import likePoi from "./LikePoiStyle.scss";

const LikePoi = ({id,like,callback,count}) => {
    // 状态
    const [likes,setLikes] = useState(like);
    // 数量
    const [counts,setCount] = useState(count);
    // 点击
    const tap = useCallback(async () => {
        const _like = await callback(id);
        if(!_like) return;
        let count = counts;
        if (!likes) count++;
        else count--;
        setCount(count);
        setLikes(!likes);
    },[callback,likes,counts]);
    useEffect(()=>{
        setLikes(like);
    },[like]);
    return (
        <div className={likePoi.like_box}>
            <div className={`${likePoi.heart} ${!likes?"":likePoi.heartAnimation}`}
                 style={ !likes ? {backgroundPosition: "left"} : {}}
                 onClick={() => tap()}/>
             <div className={likePoi.count}>{counts}</div>
        </div>
    );
};
export default LikePoi;
