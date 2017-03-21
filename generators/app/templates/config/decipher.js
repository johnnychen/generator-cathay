let crypto = require('crypto');
//解密
function decipher(encrypted){
    var algorithm = 'rc4';
    var key = "helloCathay";
    var decrypted = "";
    var decipher = crypto.createDecipher(algorithm, key);
    decrypted += decipher.update(encrypted, 'hex', 'binary');
    decrypted += decipher.final('binary');

    // console.log(decrypted+'解密后的');
    return decrypted;
}

module.exports = decipher;