export const myBrowser = () => {

    const userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    if (userAgent.indexOf("Opera") !== -1) return "Opera";// Opera浏览器
    // documentMode 是一个IE的私有属性，在IE8+中被支持。
    if (userAgent.indexOf("compatible") !== -1 && window.document.documentMode) return "IE";// IE浏览器
    if (userAgent.indexOf("Edge") !== -1) return "Edge";// Edge浏览器
    if (userAgent.indexOf("Firefox") !== -1) return "Firefox";// Firefox浏览器
    if (userAgent.indexOf("Safari") !== -1 && userAgent.indexOf("Chrome") === -1) return "Safari";// Safari浏览器
    if (userAgent.indexOf("Chrome") !== -1 && userAgent.indexOf("Safari") !== -1) return "Chrome";// Chrome浏览器
};