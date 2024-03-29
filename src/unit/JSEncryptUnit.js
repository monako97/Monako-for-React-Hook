// RSA 加密
import { JSEncrypt } from 'jsencrypt';
//十六进制转字节
function hexToBytes(hex) {
    const bytes = [];
    for (let c = 0, len = hex.length; c < len; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}
// 字节转十六进制
function bytesToHex(bytes) {
    const hex = [];
    for (let i = 0, len = bytes.length; i < len; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
    }
    return hex.join("");
}
JSEncrypt.prototype.encryptLong = function (string) {
    const k = this.getKey();
    try {
        let ct = "";
        //RSA每次加密117bytes，需要辅助方法判断字符串截取位置
        //1.获取字符串截取点
        const bytes = [];
        bytes.push(0);
        let byteNo = 0, len, c, temp = 0;
        len = string.length;
        for (let j = 0; j < len; j++) {
            c = string.charCodeAt(j);
            if (c >= 0x010000 && c <= 0x10FFFF) byteNo += 4;
            else if (c >= 0x000800 && c <= 0x00FFFF) byteNo += 3;
            else if (c >= 0x000080 && c <= 0x0007FF) byteNo += 2;
            else byteNo += 1;
            let so = byteNo % 117;
            if (so >= 114 || so === 0) {
                bytes.push(j);
                temp = byteNo;
            }
        }
        //2.截取字符串并分段加密
        if (bytes.length > 1) {
            for (let i = 0, len = bytes.length - 1; i < len; i++) {
                let str;
                if (i === 0) str = string.substring(0, bytes[i + 1] + 1);
                else str = string.substring(bytes[i] + 1, bytes[i + 1] + 1);
                const t1 = k.encrypt(str);
                ct += t1;
            }
            if (bytes[bytes.length - 1] !== string.length - 1) {
                const lastStr = string.substring(bytes[bytes.length - 1] + 1);
                ct += k.encrypt(lastStr);
            }
            return ct;
        }
        return k.encrypt(string);
    } catch (e) {
        return false;
    }
};
JSEncrypt.prototype.decryptLong = function (string) {
    const k = this.getKey(), MAX_DECRYPT_BLOCK = ((k.n.bitLength() + 7) >> 3);
    try {
        /**
         * offSet 开始长度
         * endOffSet 结束长度*/
        let ct = "", t1, bufTmp, hexTmp, offSet = 0, endOffSet = MAX_DECRYPT_BLOCK;
        const buf = hexToBytes(string), inputLen = buf.length;
        //分段解密
        while (inputLen - offSet > 0) {
            if (inputLen - offSet > MAX_DECRYPT_BLOCK) {
                bufTmp = buf.slice(offSet, endOffSet);
                hexTmp = bytesToHex(bufTmp);
                t1 = k.decrypt(hexTmp);
                ct += t1;
            } else {
                bufTmp = buf.slice(offSet, inputLen);
                hexTmp = bytesToHex(bufTmp);
                t1 = k.decrypt(hexTmp);
                ct += t1;
            }
            offSet += MAX_DECRYPT_BLOCK;
            endOffSet += MAX_DECRYPT_BLOCK;
        }
        return ct;
    } catch (e) {
        return false;
    }
};