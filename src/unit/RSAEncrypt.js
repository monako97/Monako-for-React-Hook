// RSA 加密
import "./JSEncryptUnit";
import { JSEncrypt } from 'jsencrypt';
import PUBLIC_KEY from "./PUBLIC_KEY";
const encrypt = new JSEncrypt();
encrypt.setPublicKey(PUBLIC_KEY);
export default string => encrypt.encryptLong(string);