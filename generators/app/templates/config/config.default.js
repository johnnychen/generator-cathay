'use strict';

const fs = require('fs');
const path = require('path');

module.exports = appInfo => {
    const exports = {};

    // organization your app middlewares
    exports.middleware = [
        // 'httpRecord'
    ];

    exports.keys = 'abcdefg';

    exports.logger = {
        level: 'DEBUG',
    };


    // config for middleware / plugin
    exports.responseTime = {
        header: 'x-response-time',
    };


    // exports.mysql = {
    //     // 单数据库信息配置
    //     client: {
    //         // host
    //         host: 'localhost',
    //         // 端口号
    //         port: '3306',
    //         // 用户名
    //         user: 'root',
    //         // 密码
    //         password: '',
    //         // 数据库名
    //         database: 'db_name',
    //     },
    //     // 是否加载到 app 上，默认开启
    //     app: true,
    //     // 是否加载到 agent 上，默认关闭
    //     agent: false,
    // };


    exports.security = {
        csrf: {        // 是否加载到 app 上，默认开启
            enable: false
        }
    };

     exports.view = {
       defaultViewEngine: 'nunjucks',
       mapping: {
         '.nj': 'nunjucks'
       }
     };



    return exports;
};
