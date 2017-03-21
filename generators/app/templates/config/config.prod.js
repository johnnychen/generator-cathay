'use strict';

let decipher = require('./decipher')

// only merge in local develop mode
exports.news = {
  // pageSize: 10,
};

exports.verifyCode = {
    timeout: 60
}


exports.logger = {
    level: 'INFO',
};


exports.mysql = {
    // 单数据库信息配置
    client: {
        // host
        host: 'production.host.name',
        // 端口号
        port: '3306',
        // 用户名
        user: 'rds',
        // 密码
        password: decipher('password'),
        // 数据库名
        database: 'database',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
};