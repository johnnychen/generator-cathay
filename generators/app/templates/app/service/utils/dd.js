const crypto = require('crypto');
const url = require('url');

module.exports = {
    sign: function (params) {
        let origUrl = params.url;
        let origUrlObj = url.parse(origUrl);
        delete origUrlObj['hash'];

        let newUrl = url.format(origUrlObj);
        let plain = `jsapi_ticket=${params.ticket}&noncestr=${params.nonceStr}&timestamp=${params.timeStamp}&url=${newUrl}`;
        let sha1 = crypto.createHash('sha1');

        sha1.update(plain, 'utf8');
        let signature = sha1.digest('hex');
        return signature;
    }
}