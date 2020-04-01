import React,{useCallback,useState} from "react";
import bubblyButtonStyle from "./bubblyButton.scss";
// diff
const equal = (prevProps, nextProps) => prevProps.text === nextProps.text && prevProps.callback === nextProps.callback;
const BubblyButton = ({text,callback}) => {
    const [clsName, setClsName] = useState(bubblyButtonStyle.bubbly_button);
    const animateButton = useCallback(e => {
        e.preventDefault;
        setClsName(bubblyButtonStyle.bubbly_button);
        setClsName(`${bubblyButtonStyle.bubbly_button} ${bubblyButtonStyle.animate}`);
        callback();
        let l = setTimeout(() => {
            setClsName(bubblyButtonStyle.bubbly_button);
            clearTimeout(l);
            l = null;
        },700);
    },[callback]);
    return (<button className={clsName} onClick={e=>animateButton(e)}>{text?text:"Submit"}</button>);
};
export default React.memo(BubblyButton, equal);
