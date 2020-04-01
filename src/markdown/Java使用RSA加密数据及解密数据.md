[TOC]

# 前端使用RSA公钥加密数据，Java后端使用私钥解密

#### 1. 后端：使用RSA生成一对公钥和私钥的工具类

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
import java.io.File;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

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
            File file = new File(RSAEncrypt.class.getResource("/PRIVATE_KEY.txt").getPath());
            // 获取base64编码的私钥
            PrivateKey privateKey = getPrivateKey(FileToString.txtString(file));
            //私钥解密
            byte[] strBytes=Base64.getDecoder().decode(str.getBytes());
            byte[] decryptedBytes=decrypt(strBytes, privateKey);
            // 解密后数据
            outString = new String(decryptedBytes);
        } catch (Exception e) {

        }
        return outString;
    }
    //将base64编码后的公钥字符串转成PublicKey实例
    public static PublicKey getPublicKey(String publicKey) throws Exception{
        byte[ ] keyBytes=Base64.getDecoder().decode(publicKey.getBytes());
        X509EncodedKeySpec keySpec=new X509EncodedKeySpec(keyBytes);
        KeyFactory keyFactory=KeyFactory.getInstance("RSA");
        return keyFactory.generatePublic(keySpec);
    }
    //将base64编码后的私钥字符串转成PrivateKey实例
    public static PrivateKey getPrivateKey(String privateKey) throws Exception{
        byte[ ] keyBytes=Base64.getDecoder().decode(privateKey.getBytes());
        PKCS8EncodedKeySpec keySpec=new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory keyFactory=KeyFactory.getInstance("RSA");
        return keyFactory.generatePrivate(keySpec);
    }
    //公钥加密
    public static byte[] encrypt(byte[] content, PublicKey publicKey) throws Exception{
        Cipher cipher=Cipher.getInstance("RSA");//java默认"RSA"="RSA/ECB/PKCS1Padding"
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);
        return cipher.doFinal(content);
    }
    //私钥解密
    public static byte[] decrypt(byte[] content, PrivateKey privateKey) throws Exception{
        Cipher cipher=Cipher.getInstance("RSA");
        cipher.init(Cipher.DECRYPT_MODE, privateKey);
        return cipher.doFinal(content);
    }
}
```

#### 3. 前端：使用 jsencrypt 加密

```shell
# 安装 jsencrypt
npm i jsencrypt -S
```

```javascript
// RSA 加密
import { JSEncrypt } from 'jsencrypt';
import PUBLIC_KEY from "公钥";
const encrypt = new JSEncrypt();
encrypt.setPublicKey(PUBLIC_KEY);
export default string => encrypt.encrypt(string,null,null);
// 加密登录数据
RSAEncrypt(JSON.stringify({
  	// 加密的数据
}));
```

#### 4. 后端：使用 RSAEncrypt 类解谜

```java
// RSA解密 RequestBody
String requestBody = RSAEncrypt.decrypt(body);
```

