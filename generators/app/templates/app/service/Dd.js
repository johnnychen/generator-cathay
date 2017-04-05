'use strict';

const ddUtils = require('./utils/dd');


module.exports = app => {

    const ddConfig = app.config.DD_CONFIG;


    class Dd extends app.Service {
        constructor(ctx) {
            super(ctx);
        }

        * getToken() {

            const token = app.accessToken;

            // 2小时有效期
            if (token.value && (Date.now() - token.timestamp < 7000000)) {
                return token.value;
            } else {

                let accessToken = '';

                try {
                    // accessToken: https://open-doc.dingtalk.com/docs/doc.htm?spm=a219a.7629140.0.0.KXs1PP&treeId=172&articleId=104980&docType=1
                    let result = yield this.app.curl(`https://oapi.dingtalk.com/gettoken?corpid=${ddConfig.corpId}&corpsecret=${ddConfig.secret}`, {
                        dataType: 'json'
                    });

                    accessToken = result.data.access_token;

                    app.accessToken.value = accessToken;
                    app.accessToken.time = Date.now();
                } catch (e) {
                    app.logger.error(`Get Dingding accesstoken error: ${e}`);
                }

                return accessToken;
            }

        }

        * sendMessage(jobNumber, data) {

            let userInfo = yield this.ctx.service.employee.get(jobNumber);
            let ddUserId = userInfo.ddUserId;

            let token = yield this.getToken();

            // 关于发送消息: https://open-doc.dingtalk.com/docs/doc.htm?spm=a219a.7629140.0.0.yNuU0E&treeId=172&articleId=104974&docType=1
            // 关于消息类型: https://open-doc.dingtalk.com/doc2/detail.htm?spm=a219a.7629140.0.0.Tt0dQ6&treeId=172&articleId=104972&docType=1#s4

            app.logger.info(`before sendMessage to Dingding, jobNumber and ddUserId: ${jobNumber} ${ddUserId}`);

            const result = yield this.app.curl(`https://oapi.dingtalk.com/message/send?access_token=${token}`, {
                method: 'POST',
                contentType: "json",
                dataType: 'json',
                data: {
                    "touser": `${ddUserId}`,
                    "agentid": `${ddConfig.studySignAgentId}`,
                    "msgtype": "oa",
                    "oa": data
                }
            });

            const resultData = result.data;

            if (resultData.errcode) {
                app.logger.error(`sendMessage to Dingding error: ${resultData}`);
            }

            app.logger.info(`end sendMessage to Dingding`);

            return !resultData.errcode;
        }

        * getJsApiConfig(originUrl) {

            // 获取jsapi_ticket: https://open-doc.dingtalk.com/docs/doc.htm?spm=a219a.7629140.0.0.C3TiBr&treeId=172&articleId=104966&docType=1
            // @TODO jsticket时间限制
            let token = yield this.getToken();
            let ticketResult = yield this.app.curl(`https://oapi.dingtalk.com/get_jsapi_ticket?type=jsapi&access_token=${token}`, {
                dataType: 'json'
            });
            let ticket = ticketResult.data.ticket;

            // https://open-doc.dingtalk.com/docs/doc.htm?spm=a219a.7629140.0.0.qw2yFM&treeId=171&articleId=104910&docType=1
            let signedUrl = decodeURIComponent(originUrl || this.ctx.request.header.referer);
            let timeStamp = new Date().getTime();

            // this.ctx.logger.debug(signedUrl)


            let signature = ddUtils.sign({
                nonceStr: ddConfig.nonceStr,
                timeStamp: timeStamp,
                url: signedUrl,
                ticket: ticket
            });

            let result = {
                token: token,
                signature: signature,
                nonceStr: ddConfig.nonceStr,
                timeStamp: timeStamp,
                corpId: ddConfig.corpId,
                agentId: ddConfig.studySignAgentId
            };
            return result;
        }

        * getUserInfo(code) {
            let token = yield this.getToken();
            let userIdResult = yield this.app.curl(`https://oapi.dingtalk.com/user/getuserinfo?access_token=${token}&code=${code}`, {
                dataType: 'json',
                method: 'GET'
            });

            let userId = userIdResult.data.userid;

            let infoResult = yield this.app.curl(`https://oapi.dingtalk.com/user/get?access_token=${token}&userid=${userId}`, {
                dataType: 'json',
                method: 'GET'
            });

            return infoResult.data;
        }

    }

    return Dd;
}
