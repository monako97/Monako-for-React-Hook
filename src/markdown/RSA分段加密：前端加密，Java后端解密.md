[TOC]

# RSA分段加密：前端使用公钥进行分段加密，Java后端使用私钥分段解密

#### 1. 后端：生成一对公钥和私钥的工具类

使用RSA生成一对公钥和私钥的工具类

```java
import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.security.Key;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.HashMap;
import java.util.Map;

public class RSAKEYUtil {
    public static final String KEY_ALGORITHM = "RSA";
    private static final String PUBLIC_KEY = "RSAPublicKeyByTest";
    private static final String PRIVATE_KEY = "RSAPrivateKeyByTest";
    // 生产密钥
    public static void main(String[] args) {
        Map<String, Object> keyMap;
        try {
            keyMap = initKey();
            String publicKey = getPublicKey(keyMap);
            BufferedWriter PUBLIC = new BufferedWriter(new FileWriter("公钥文件保存路径"));
            PUBLIC.write(publicKey);
            PUBLIC.close();
            String privateKey = getPrivateKey(keyMap);
            BufferedWriter PRIVATE = new BufferedWriter(new FileWriter("私钥文件保存路径"));
            PRIVATE.write(privateKey);
            PRIVATE.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static String getPublicKey(Map<String, Object> keyMap) throws Exception {
        Key key = (Key) keyMap.get(PUBLIC_KEY);
        return encryptBASE64(key.getEncoded());
    }

    public static String getPrivateKey(Map<String, Object> keyMap) throws Exception {
        Key key = (Key) keyMap.get(PRIVATE_KEY);
        return encryptBASE64(key.getEncoded());
    }

    public static String encryptBASE64(byte[] key) throws Exception {

        return (new BASE64Encoder()).encodeBuffer(key);
    }

    public static byte[] decryptBASE64(String key) throws Exception {
        return (new BASE64Decoder()).decodeBuffer(key);
    }

    public static Map<String, Object> initKey() throws Exception {
        KeyPairGenerator keyPairGen = KeyPairGenerator.getInstance(KEY_ALGORITHM);
        // 密钥位数
        keyPairGen.initialize(1024);
        KeyPair keyPair = keyPairGen.generateKeyPair();

        RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
        RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();

        Map<String, Object> keyMap = new HashMap<>(4);
        keyMap.put(PUBLIC_KEY, publicKey);
        keyMap.put(PRIVATE_KEY, privateKey);
        return keyMap;
    }
}
```

#### 2. 后端：RSA解密的工具类

```java
import javax.crypto.Cipher;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
/**
 * @author monako
 */
public class RSAEncrypt {
    /**
     * RSA私钥解密
     * @param str 加密字符串
     * @return 私钥解密后的内容
     */
    public static String decrypt(String str) {
        String outString = "";
        try {
            // 读取私钥文件
            File file = new File(RSAEncrypt.class.getResource("私钥文件").getPath());
            // 获取base64编码的私钥
            PrivateKey privateKey = getPrivateKey(FileToString.txtString(file));
            //私钥解密
            byte[] strBytes = ByteToHexUtil.hexToByte(str);
            byte[] decryptedBytes = decrypt(strBytes, privateKey);
            // 解密后数据
            outString = new String(decryptedBytes);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return outString;
    }
    /**
     * 将base64编码后的公钥字符串转成PublicKey实例*/
    public static PublicKey getPublicKey(String publicKey) throws Exception{
        byte[ ] keyBytes=Base64.getDecoder().decode(publicKey.getBytes());
        X509EncodedKeySpec keySpec=new X509EncodedKeySpec(keyBytes);
        KeyFactory keyFactory=KeyFactory.getInstance("RSA");
        return keyFactory.generatePublic(keySpec);
    }
    /**
     * 将base64编码后的私钥字符串转成PrivateKey实例*/
    public static PrivateKey getPrivateKey(String privateKey) throws Exception{
        byte[ ] keyBytes=Base64.getDecoder().decode(privateKey.getBytes());
        PKCS8EncodedKeySpec keySpec=new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory keyFactory=KeyFactory.getInstance("RSA");
        return keyFactory.generatePrivate(keySpec);
    }
    /**
     * 公钥加密*/
    public static byte[] encrypt(byte[] content, PublicKey publicKey) throws Exception{
        //java默认"RSA"="RSA/ECB/PKCS1Padding"
        Cipher cipher=Cipher.getInstance("RSA");
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);
        return cipher.doFinal(content);
    }
    /**
     * 私钥解密*/
    public static byte[] decrypt(byte[] encryptedData, PrivateKey privateKey) throws Exception{
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.DECRYPT_MODE, privateKey);
        int inputLen = encryptedData.length;
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        int offSet = 0, max = 128;
        byte[] cache;
        int i = 0;
        // 对数据分段解密
        while (inputLen - offSet > 0) {
            if (inputLen - offSet > max) {
                cache = cipher.doFinal(encryptedData, offSet, max);
            } else {
                cache = cipher.doFinal(encryptedData, offSet, inputLen - offSet);
            }
            out.write(cache, 0, cache.length);
            i++;
            offSet = i * max;
        }
        byte[] decryptedData = out.toByteArray();
        out.close();
        return decryptedData;
    }
}
```

#### 3. 前端：使用 jsencrypt 加密

```shell
# 安装 jsencrypt
npm i jsencrypt -S
```

##### 创建一个JSEncryptUnit.js

```javascript
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
// 分段加密
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
// 分段解密
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
```

##### 创建一个RSAEncrypt.js

```javascript
// RSA 加密
import "./JSEncryptUnit";
import { JSEncrypt } from 'jsencrypt';
import PUBLIC_KEY from "公钥";
const encrypt = new JSEncrypt();
encrypt.setPublicKey(PUBLIC_KEY);
export default string => encrypt.encryptLong(string);
```

##### 使用：

```javascript
import RSAEncrypt from "./RSAEncrypt";
// 加密
RSAEncrypt(JSON.stringify({email: email,password: password}));
```



#### 4. 后端：使用 RSAEncrypt 类解谜

```java
// RSA解密 RequestBody
String requestBody = RSAEncrypt.decrypt(body);
```

