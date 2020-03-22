export const NotificationUtil = (title,options) => {
    if ("Notification" in window) {
        // 此浏览器支持消息提醒功能，开启消息提醒
        // granted 表示用户允许该网站显示通知
        if (Notification.permission === 'granted') notify(title,options);
        else Notification.requestPermission().then(permission => { if (permission === 'granted') notify(title, options); });
        function notify($title, $options) {
            const notification = new Notification($title, $options);
            notification.onclick = function(event){
                console.log('click : ',event);
                notification.close();
            }
        }
    }
};