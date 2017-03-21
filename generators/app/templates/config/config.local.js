'use strict';

// only merge in local develop mode
exports.news = {
    // pageSize: 10,
};

exports.verifyCode = {
    //timeout: 3600 * 24 *30
    timeout: 60 
}


exports.mysql = {
    // 单数据库信息配置
    client: {
        // host
        host: '10.164.50.22',
        // 端口号
        port: '3300',
        // 用户名
        user: 'DBSA1',
        // 密码
        password: 'DBSA1',
        // 数据库名
        database: 'cathay_employee',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
};