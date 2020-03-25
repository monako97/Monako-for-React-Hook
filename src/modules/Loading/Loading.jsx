import React from "react";
import loadingStyle from "./loadingStyle.scss";
const Loading = () => {
    return (<div className={loadingStyle.loading}>
        <div className={loadingStyle.elves}/>
        <div className={loadingStyle.star}/>
    </div>);
};
export default Loading;
