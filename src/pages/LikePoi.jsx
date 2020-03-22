import React,{useState,useCallback} from "react";
import likePoi from "../style/LikePoiStyle.scss";
const LikePoi = ({id,like,callback,count}) => {
    // 状态
    const [likes,setLikes] = useState(like);
    // 数量
    const [counts,setCount] = useState(count);
    // 点击
    const tap = useCallback(() => {
        callback(likes,id);
        let count = counts;
        if (!likes) count++;
        else count--;
        setCount(count);
        setLikes(!likes);
    },[callback,likes,counts]);
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
