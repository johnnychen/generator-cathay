'use strict';

const isLocal = process.env.NODE_ENV !== 'production' && !process.env.EGG_SERVER_ENV;

require('egg').startCluster({
    baseDir: __dirname,
    port: process.env.PORT || 7003, // default to 7003
    workers: isLocal ? 1 : null, // default to cpu count
});
