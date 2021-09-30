const CryptoJS = require("crypto-js");
const AES = CryptoJS.AES;

async function __encryptData(plainText) {
    const encrypt = AES.encrypt(plainText, config.get("auth.aes.secret"))
    console.log("encrypt", encrypt.toString());
    return encrypt.toString()
}

async function __decryptData(cipherText) {
    const bytes = AES.decrypt(cipherText, config.get("auth.aes.secret"))
    const decrypt = bytes.toString(CryptoJS.enc.Utf8)
    console.log("decrypt", decrypt);
    return decrypt
}

module.exports = {
    encryptMessage: __encryptData,
    decryptMessage: __decryptData
}
