import {Card, List, Button, NavBar, WingBlank, WhiteSpace, Flex, Modal, Toast, Result} from 'antd-mobile';

import React from 'react';
import ReactDOM from 'react-dom';
import fetch from 'isomorphic-fetch'


class MobileDemo extends React.Component {
    constructor() {
        super();


        fetch(`/api/dd/getJsApi?originalUrl=${location.href}`, {
            method: 'get',
            credentials: 'same-origin'
        }).then(res => {
            return res.json()
        }).then(data => {
            this.ddInit(data);
        });

    }

    ddInit(config) {

        var ddConfig = {
            token: config.token,
            agentId: config.agentId,
            corpId: config.corpId,
            timeStamp: config.timeStamp,
            nonceStr: config.nonceStr,
            signature: config.signature,
            jsApiList: ['device.notification.confirm',
                'device.notification.alert',
                'device.notification.prompt',
                'biz.chat.chooseConversation',
                'biz.ding.post']
        };


        dd.config(ddConfig);


        dd.ready(() => {
            // alert('dingindg ready');
            /***
             * https://open-doc.dingtalk.com/doc2/detail.htm?spm=a219a.7629140.0.0.uwxREt&treeId=171&articleId=104911&docType=1#s1
             */
            dd.runtime.permission.requestAuthCode({
                corpId: config.corpId, //企业id
                onSuccess: (info) => {

                    this.signin(info.code);

                },
                onFail: function (err) {
                    alert('requestAuthCode fail: ' + JSON.stringify(err));
                }
            });
        });
        dd.error((e) => {
            alert('钉钉client-api链接失败, 请您确认是在钉钉手机APP中打开此链接?' + JSON.stringify(e));
        });

    }

    signin(authCode) {
        // alert('before signin')
        fetch(`/api/user/signin/${authCode}`, {
            method: 'get',
            credentials: 'same-origin'
        }).then(res => {
            return res.json()
        }).then(res => {
            this.setState({
                name: res.data.name,
                mobile: res.data.mobile,
                message: res.message
            });
        });
    }

    render() {

    }
}


ReactDOM.render(<MobileDemo />, document.getElementById('root'));


