'use strict';

// only merge in local develop mode
exports.news = {
    // pageSize: 10,
};

exports.verifyCode = {
    timeout: 60
}

exports.mysql = {
    // 单数据库信息配置
    client: {
        // host
        host: 'rm-1te40r36432k96d50.mysql.rds.aliyuncs.com',
        // 端口号
        port: '3306',
        // 用户名
        user: 'rds',
        // 密码
        password: 'biportal',
        // 数据库名
        database: 'cathay_employee',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
};
