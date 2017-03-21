'use strict';

// can use in template {{ helper.lowercaseFirst(str) }}
exports.lowercaseFirst = str => str[0].toLowerCase() + str.substring(1);


exports.doLogin = (ctx, loginId) => {
    ctx.cookies.set('loginId', loginId, {
        sign: true
    });
}

exports.doLogout = (ctx) => {
    ctx.cookies.set('loginId', '', {
        sign: true
    });
}
