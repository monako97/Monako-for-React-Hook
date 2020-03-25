import React,{useEffect} from "react";
// live2d
import "./live2d_lib";
const equal = (prevProps, nextProps) => {
	/** 
     * 与shouldComponentUpdate相似，但是这是用来判断prevProps和nextProps是否相等，
     * 相等返回true,组件不发生重新渲染；反之，组件重新渲染。主要用于性能优化，
     * 不要过于依赖，容易发生bug
	 **/
    return prevProps.model === nextProps.model && prevProps.width === nextProps.width && prevProps.height === nextProps.height;
};
const Live2D = ({model,width,height}) => {
    useEffect(() => {
        loadlive2d("live2d", model);
    }, [model]);
    return (
        <canvas id="live2d" width={width} height={height} style={{
            position: "fixed",
            bottom: 0,
            right: "5%",
            zIndex: 999999 }}/>
    );
};
export default React.memo(Live2D, equal);
