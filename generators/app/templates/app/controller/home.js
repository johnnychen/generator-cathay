'use strict';


exports.test = function* homeController() {

    const testjson = {};

    this.body = 'hello, world!' + JSON.stringify(testjson);

    // yield this.render('home/index.nj',{title:'测试'});
};

