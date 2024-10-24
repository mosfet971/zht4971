import crypto from "crypto";

let exp = {};

function hexToByte(hx) {
    return Uint8Array.from(Buffer.from(hx, "hex"));
}

exp.toByte = function (message) {
    return (hexToByte(message));
}

exp.newUUID = function () {
    return (crypto.randomUUID());
}
/*
exp.sha256 = function (message) {
    message = crypto.createHash('sha256').update(message).digest("hex");
    message = hexToByte(message);

    //console.log(message);
    return (message);
}
*/
exp.slowSha256 = function (message) {
    /*
    for (let i = 0; i < 50000; i++) {
        message = crypto.createHash('sha256').update(message + String(i)).digest("hex");
    }
    */
    let message2 = crypto.pbkdf2Sync(message, "ase4q44w44s4w4h2qgd31231un2w", 100000, 32, 'sha512');
    //message2 = new Uint8Array(message2);

    //console.log(message2);
    //message2 = hexToByte(message2);
    //console.log(message);
    return (message2.toString("hex"));
}

exp.random256hex = function () {
    let out = crypto.randomBytes(32).toString("hex");
    return (out);
}

exp.aes256 = {
    encryptString(message, key) {
        //console.log("encryptString", key);
        let iv = crypto.randomBytes(16);
        let mkey = hexToByte(key);

        let encrypter = crypto.createCipheriv("aes-256-cbc", mkey, iv);
        let encryptedMsg = encrypter.update(message, "utf-8", "base64");

        encryptedMsg += encrypter.final("base64");

        //console.log("Encrypted message: " + encryptedMsg);
        return ({ aesMessage: encryptedMsg, aesIv: iv.toString("hex") });
    },
    decryptString(message, key, iv) {
        //console.log("decryptString", key);
        let iv2 = hexToByte(iv);
        let mkey = hexToByte(key);

        const decrypter = crypto.createDecipheriv("aes-256-cbc", mkey, iv2);
        let decryptedMsg = decrypter.update(message, "base64", "utf8");
        
        decryptedMsg += decrypter.final("utf8");

        //console.log("Decrypted message: " + decryptedMsg);
        return (decryptedMsg);
    },
    encryptBuffer(buffer, key) {
        //console.log("encryptBuffer", key);
        let mkey = hexToByte(key);
        let iv = crypto.randomBytes(16);
        let cipher = crypto.createCipheriv('aes-256-cbc', mkey, iv);
        let crypted = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
        return crypted;
    }, 
    decryptBuffer(encryptedBuffer, key) {
        //console.log("decryptBuffer", key);
        let mkey = hexToByte(key);
        let iv = encryptedBuffer.subarray(0, 16);
        let buffer = encryptedBuffer.subarray(16, encryptedBuffer.byteLength)
        let decipher = crypto.createDecipheriv('aes-256-cbc', mkey, iv)
        let dec = Buffer.concat([decipher.update(buffer), decipher.final()]);
        return dec;
    }
}

export default exp;