'use strict';

module.exports = app => {

    app.get('/', 'home.test');

    app.get('/schedule/trigger-employee-diff', 'schedule.triggerEmployeeDiff');

    app.get('/schedule/trigger-employee-match', 'schedule.triggerEmployeeMatch');

};

