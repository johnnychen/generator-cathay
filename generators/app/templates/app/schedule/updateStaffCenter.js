module.exports = {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  schedule: {
    //cron: '0 0 * */1 * *',
    interval: '5s',
    type: 'all', // 指定随机的 worker 都需要执行
  },
  // task 是真正定时任务执行时被运行的函数，第一个参数是一个匿名的 Context 实例
  * task(ctx) {
    //yield ctx.service.getCoreMessage.getStaffCenter();
    yield ctx.service.users.main();

    yield ctx.service.users.keepEmployeesLatest();
    
    //yield ctx.service.getCoreMessage.getMessage() ;
    //ctx.app.controller.getCoreMessage.getCore;
    //ctx.Service.getMessage();

    // const res = yield ctx.curl('http://10.167.11.202:9080/servlet/RESTfulServlet/CommonMethods/queryEmployee', {

    // });
    // let data = res.data;
    //  console.log(data);
  },
};