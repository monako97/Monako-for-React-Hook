/**
 * 时间转换成指定格式日期
 * new Date(11111111111111).format('Y年m月d日 H时i分'); // "2322年02月06日 03时45分"
 * formats格式包括 Y-m-d
 * Y-m-d H:i:s
 * Y年m月d日
 * Y年m月d日 H时i分 ...
 */
Date.prototype.format = function(formats){
    formats = formats || 'Y-m-d';
    const zero = value => value < 10 ? '0' + value : value;
    return formats.replace(/[YmdHis]/ig, matches => ({
        Y: this.getFullYear(),
        m: zero(this.getMonth() + 1),
        d: zero(this.getDate()),
        H: zero(this.getHours()),
        i: zero(this.getMinutes()),
        s: zero(this.getSeconds())
    })[matches]);
};
