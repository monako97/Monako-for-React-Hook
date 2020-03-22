import React from "react";
import style from "./style.scss";
export const ProgressBar = ({ progress }) => {
    return (<div className={style.progress_bar_box}>
        <p className={style.info}>{ progress }</p>
        <div className={style.progress_bar}>
            <div className={style.progress_bar_inner} style={{transform: `translateX(${progress - 100}%) translateZ(0)`}}/>
        </div>
    </div>);
};