'use strict';


exports.triggerEmployeeDiff = function*() {


    let result = yield this.service.users.main();

    this.body = 'PROCESSED OK';

    // yield this.render('home/index.nj',{title:'测试'});
};


exports.triggerEmployeeMatch = function *() {

    let result = yield this.service.users.keepEmployeesLatest();

    this.body = 'PROCESSED OK';

}
