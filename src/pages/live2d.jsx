import React,{useEffect} from "react";
// live2d
import "../lib/live2d";
export default ({model,width,height}) => {
    useEffect(() => {
        loadlive2d("live2d", model);
    }, []);
    return (<canvas id="live2d" width={width} height={height} style={{
        position: "fixed",
        bottom: 0,
        right: "5%",
        zIndex: 999999
    }}/>);
}
