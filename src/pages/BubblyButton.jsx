import React,{useCallback,useState} from "react";
import bubblyButtonStyle from "../style/bubblyButton.scss";
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
    return <button className={clsName}
    onClick={e=>animateButton(e)}>{text?text:"Submit"}</button>
};
export default BubblyButton;
