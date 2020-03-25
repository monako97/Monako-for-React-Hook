import React from 'react';
import style from './style.scss';
import {CSSTransition, TransitionGroup} from "react-transition-group";
import Loading from "../Loading/Loading";
const icons = {
    info: 'iconinfo',
    success: 'iconsuccess',
    danger: 'icon14CIRCLE',
    primary: 'iconzan-f',
    warning: 'iconfy_ic_warnning'
};
const Toast = ({notice,callback,duration,onClose}) => {
    const [show,setShow] = React.useState(true);
    // 执行退场动画
    if (duration !== -1) {
        let _timer = setTimeout(() => {
            setShow(false);
            clearTimeout(_timer);
            _timer = null;
        },duration);
    }
    return (<>
        { notice.type === "loading" ? <Loading/> :
            <TransitionGroup component={null} appear={true}>
                { show ? <CSSTransition
                    timeout={300}
                    classNames="down"
                    appear={true}>
                    <div className={style[notice.type]}>
                        <i className={`monako__icon ${icons[notice.type]}`}/>
                        <strong>{ notice.content }</strong>
                        { onClose ? <i className={`monako__icon iconclose ${style.close}`} onClick={() => callback()}/> : null }
                    </div>
                </CSSTransition> : null }
            </TransitionGroup> }
    </>);
};
export default Toast;
