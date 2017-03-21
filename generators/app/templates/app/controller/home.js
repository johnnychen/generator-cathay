'use strict';


exports.test = function* homeController() {


    const testjson = {};

    // const testjson = yield this.service.dingding.sendMessage('0100008240', {
    //                    "message_url": "http://dingtalk.com",
    //                    "head": {
    //                        "bgcolor": "FFBBBBBB",
    //                        "text": "来自老系统核心的请假审批"
    //                    },
    //                    "body": {
    //                        "title": "移动审批",
    //                        "form": [
    //                            {
    //                                "key": "申请人:",
    //                                "value": "陈强"
    //                            },
    //                            {
    //                                "key": "部门:",
    //                                "value": "信息技术部"
    //                            },
    //                            {
    //                                "key": "申请系统:",
    //                                "value": "老系统核心"
    //                            },
    //                            {
    //                                "key": "申请类别:",
    //                                "value": "请假"
    //                            }
    //                        ],
    //                        "content": "我的牙痛,需要申请呀 " + Math.random()
    //                    }
    //                });


    this.body = 'hello, world!' + JSON.stringify(testjson);

    // yield this.render('home/index.nj',{title:'测试'});
};

