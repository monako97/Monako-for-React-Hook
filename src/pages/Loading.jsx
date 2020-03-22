import React from "react";
import loadingStyle from "../style/loadingStyle.scss";
const Loading = () => {
    return (<div className={loadingStyle.loading}>
        <div className={loadingStyle.elves}/>
        <div className={loadingStyle.star}/>
    </div>);
};
export default Loading;
