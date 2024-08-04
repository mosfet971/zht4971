import crypto from "crypto";

let exp = {};

function hexToByte(hx) {
    let unsignedIntegers = hx.match(/[\dA-F]{2}/gi).map(function (s) {
        return parseInt(s, 16);
    });
    hx = new Uint8Array(unsignedIntegers);
    return hx;
}

exp.toByte = function (message) {
    return (hexToByte(message));
}

exp.newUUID = function () {
    return (crypto.randomUUID());
}

exp.sha256 = function (message) {
    message = crypto.createHash('sha256').update(message).digest("hex");
    message = hexToByte(message);

    //console.log(message);
    return (message);
}

exp.slowSha256 = function (message) {

    for (let i = 0; i < 50000; i++) {
        message = crypto.createHash('sha256').update(message + String(i)).digest("hex");
    }

    //console.log(message);
    message = hexToByte(message);
    //console.log(message);
    return (message);
}

exp.random256hex = function () {
    let out = crypto.randomBytes(32).toString("hex");
    return (out);
}

exp.aes256 = {
    encryptString(message, key) {
        let ivHex = crypto.randomBytes(16).toString("hex");
        let iv = hexToByte(crypto.randomBytes(16).toString("hex"));
        let pad_block = "canavelacanavela";
        let start_marker = "s1t1a1r1t1";

        let encrypter = crypto.createCipheriv("aes-256-cbc", key, iv);
        let encryptedMsg = encrypter.update(pad_block + (start_marker + message), "utf-8", "base64");
        encryptedMsg += encrypter.final("base64");

        //console.log("Encrypted message: " + encryptedMsg);
        return ({ aesMessage: encryptedMsg, aesIv: ivHex });
    },
    decryptString(message, key, iv) {
        let iv2 = hexToByte(iv);
        let start_marker = "s1t1a1r1t1";

        const decrypter = crypto.createDecipheriv("aes-256-cbc", key, iv2);
        let decryptedMsg = decrypter.update(message, "base64", "utf8");
        decryptedMsg += decrypter.final("utf8");

        decryptedMsg = decryptedMsg.split(start_marker)[1];

        //console.log("Decrypted message: " + decryptedMsg);
        return (decryptedMsg);
    },
    encryptBuffer(buffer, key) {
        let mkey = Buffer.from(key).subarray(0, 32);
        let iv = crypto.randomBytes(16);
        let cipher = crypto.createCipheriv('aes-256-cbc', mkey, iv);
        let crypted = Buffer.concat([iv, cipher.update(buffer),cipher.final()]);
        return crypted;
    }, 
    decryptBuffer(encryptedBuffer, key) {
        let mkey = Buffer.from(key).subarray(0, 32);
        let iv = encryptedBuffer.subarray(0, 16);
        let buffer = encryptedBuffer.subarray(16, encryptedBuffer.byteLength)
        let decipher = crypto.createDecipheriv('aes-256-cbc', mkey, iv)
        let dec = Buffer.concat([decipher.update(buffer) , decipher.final()]);
        return dec;
    }
}

export default exp;