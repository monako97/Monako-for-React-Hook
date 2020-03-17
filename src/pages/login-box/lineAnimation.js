import animationJs from "animejs";
// animejs实例
let current = null;
export default (strokeDashoffsetValue, strokeDasharrayValue, callback) => {
    if (callback) callback(strokeDashoffsetValue);
    if (current!==null) current.pause();
    current = animationJs({
        targets: '#ling',
        strokeDashoffset: {
            value: strokeDashoffsetValue,
            duration: 700,
            easing: 'easeOutQuart'
        },
        strokeDasharray: {
            value: strokeDasharrayValue,
            duration: 700,
            easing: 'easeOutQuart'
        }
    });
};
