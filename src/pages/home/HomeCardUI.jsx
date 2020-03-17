import React from "react";
import homeStyle from "../../style/home-container.scss";
import dateFormat from "../../unit/dateFormat";

export default ({handleClick, list, index, style}) => {
    return <article style={{
        position: style.position,
        top: parseFloat(style.top) + 70 + "px",
        left: style.left,
        width: style.width
    }} data-index={index}>
        <a className={homeStyle.card_bg} style={{backgroundImage: "url(" + list[index]['image'] + ")"}}
              onClick={() => handleClick(list[index])} />
        <p className={homeStyle.title}>{list[index]['title']}</p>
        <time>{dateFormat(list[index]['create_time'], "Y年m月d日 H时i分")}</time>
        <hr/>
        <aside>{list[index]['sub_title']}</aside>
        <a className={homeStyle.btn_reading}
              onClick={() => handleClick(list[index])}>Continue Reading →</a>
    </article>
}
