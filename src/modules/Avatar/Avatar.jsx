import React from "react";
import avatarStyle from "./avatarStyle.scss";
const equal = (prevProps, nextProps) => prevProps.imgSrc === nextProps.imgSrc;
const Avatar = ({imgSrc, style}) => {
    return (<div className={avatarStyle.avatar}>
        <img src={imgSrc ? imgSrc : "../../static/images/avatar.png"} style={{
            ...style,
            ...{ opacity: imgSrc ? 1 : 0.3 }
        }} alt=""/>
    </div>);
};
export default React.memo(Avatar, equal);
