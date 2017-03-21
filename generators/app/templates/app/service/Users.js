'use strict';

module.exports = app => {

    const DDURL = app.config.DDURL;
    const COREURL =app.config.COREURL;

    class Users extends app.Service {
        constructor(ctx) {
            super(ctx);
        }

        * main() {
            // 1. 获取老系统核心中所有数据
            const coreUsers = yield this.getCoreUsers();

            // 2. 获取员工中心所有数据(初始化)
            const allEmployees = yield this.getEmployees();

            // 3. 生成老系统核心用户map
            const coreUserMap = coreUsers.reduce((obj, user) => {
                obj[user.EMP_NO] = user;
                return obj;
            }, {});
            //console.log(coreUserMap);

            // 4. 生成员工中心员工map
            const employeeMap = allEmployees.reduce((obj, employee) => {
                obj[employee.jobNumber] = employee;
                return obj;
            }, {});

            // 5. 标识入职人员
    
            const enrollUsers = coreUsers.filter((user) => {
                if (!employeeMap[user.EMP_NO]) {
                    return true;
                }
            })

            // 6. 标识离职人员
            const resignUsers = allEmployees.filter((employee) => {
                if (!coreUserMap[employee.jobNumber] && !employee.isResigned) {
                    return true;
                }
            })

            // 7. 进行入职操作
            yield this.enrollEmployees(enrollUsers);//update数据库(ddUserId 加上)

            // 8. 进行离职操作(包含ddUserId)
            yield this.resignEmployees(resignUsers);//打个离职标识(update  employee)

        }

        * keepEmployeesLatest() {

            // 1. 获取老系统核心中所有数据
            const coreUsers = yield this.getCoreUsers();


            // 2. 获取员工中心所有数据(初始化)
            const allEmployees = yield this.getEmployees();

            // 3. 生成员工中心员工map
            const employeeMap = allEmployees.reduce((obj, employee) => {
                obj[employee.jobNumber] = employee;
                return obj;
            }, {});

            // 4. 标识并获取老系统核心更新过的人员
            let toUpdateUsers = [];
            coreUsers.forEach((coreUser) => {
                const employee = employeeMap[coreUser.EMP_NO];//????const employee = employeeMap[coreUser.EMP_NO];
                let isUpdated = false;

                if (coreUser.EMP_NAME != employee.name) {
                    employee.name = coreUser.EMP_NAME;
                    isUpdated = true;
                }
                if (coreUser.EMAIL != employee.email) {
                    employee.email = coreUser.EMAIL;
                    isUpdated = true;
                }
                if (coreUser.POSITION != employee.position) {
                    employee.position = coreUser.POSITION;
                    isUpdated = true;
                }
                if (coreUser.TEL != employee.tel) {
                    employee.tel = coreUser.TEL;
                    isUpdated = true;
                }
                if (coreUser.EMP_NO != employee.jobNumber) {
                    employee.jobNumber = coreUser.EMP_NO;
                    isUpdated = true;
                }
                if (isUpdated) {
                    toUpdateUsers.push(employee);

                }
            });

            // 5. 进行更新操作
            for (let user of toUpdateUsers) {
                yield this.updateDdUser(user);
                yield this.updateEmployee(user);
            }
        }

        * getCoreUsers() {

            const res = yield this.ctx.curl(`${COREURL}`, {
                dataType: 'json',
                method:'POST',
                timeout: 30000
            });
            return res.data.data;


            // let res = {"data":
            //     [   
            //         {"department":[1],"POLICY_PARTY":"03","RACE":"01","TEL_NUM":"","CUSTOMER_NUMBER":"0005019688","FOREIGNER":"0","RE_EMPLOY":"0","UPDATED_EMPNO":"0100007118","UPDATED_DT":"2017-01-13 20:15:06","MOBILE":"18511796281","EMP_ID":"610425198104090215","SCHOOL_DEGREE":"02","MARRIAGE":"1","UPDATE_CODE":"2","CONTRACT_MM":"0","DIV_NO":"010356","EFFECT_DATE":"20170113","RANK":"C","TEL_REGION":"","BIRTHDAY":"9999-10-10","POSITION":"1B","CONTRACT_DD":"0","DEGREE":"1","EMPLOY_DATE":"2011-06-21","EMAIL":"aaaa@aaa.com","CHANGE_DATE":"2017-01-13 20:15:06","SEX":"1","SECURITY_DEPOSIT":"","CONTRACT_ENDDT":"2017-03-20","EMP_NO":"0100008240","POSITION_DATE":"20150901","EMP_NAME":"冯智能","CONTRACT_BEGDT":"2014-03-21","ASSIGN_CODE":"2","ID_TP":"1","STATUS":"11","TRUTH_DATE":"2017-01-13","CONTRACT_YY":"3","DIV_NO2":"00200","HEIGHT":"200","ARRIVAL_DATE":"2011-03-21","ARRIVAL_WKYM":"","TEL_EXT":"5232","SALES_TYPE":"03","RANK2":"C3","PW_BI":"{140bce22f287ac610fa4e216b2dd496f}"},
            //     ]
            // }; 
            // let res={"data":[]}
            // return res.data;

        }


        * getEmployees() {
            const records = yield this.app.mysql.select('employee', { // 搜索 employee 表
            });
            return records;
        }


        * enrollEmployees(users) {
            for (let user of users) {
                // 钉钉增加
                let result = yield this.ctx.curl(`${DDURL}/dd/user`, {
                    dataType: 'json',
                    contentType: 'json',
                    method: 'POST',
                    timeout: 30000,
                    data: {
                        name: user.EMP_NAME,
                        position: user.POSITION,
                        jobNumber: user.EMP_NO,
                        mobile: user.MOBILE,
                        email: user.EMAIL,
                        department: user.department,
                        userid: user.MOBILE
                        //tel:obj.,
                        //worksPlace:obj.,
                        //remark:obj.
                    }
                });
                // 添加钉钉员工后，获取钉钉ID(userid)，然后再merge到员工中心obj
                //console.log(JSON.stringify(result)+`result.....`);
                let ddId = result.data;
                user.ddId = ddId.userid;

                // 员工中心增加
                yield this.insertEmployee(user); //插入操作

            }


        }

        * resignEmployees(employees) {

            for (let employee of employees) {
                // @TODO
                // 删除老系统核心

                // 离职人员
                // 推送给钉钉(员工离职)
                let outGo = yield this.ctx.curl(`${DDURL}/dd/user/${employee.ddUserId}`, {
                    method: 'DELETE',
                    dataType: 'json',
                });
                //console.log(JSON.stringify(outGo)+`离职操作！！！?????加个判断`);
                //在员工中心打个离职标识
                let vo={ resigned: '1',gmt_modified: this.app.mysql.literals.now };
                let outGoResigned = yield this.app.mysql.update('employee',vo,{
                    where:{
                        ddUserId: employee.ddUserId
                    }
                });
            }

        }


        // TODO 目前用不到
        // *getEmployee(obj) {
        //     const record = yield this.app.mysql.select('employee', { // 搜索 employee 表
        //         where: {jobNumber: obj.EMP_NO}  // WHERE 条件
        //     });
        //
        //     return record;
        // }

        * insertEmployee(obj) {
            const record = yield this.app.mysql.insert('employee', {
                name: obj.EMP_NAME,
                position: obj.POSITION,
                jobNumber: obj.EMP_NO,
                mobile: obj.MOBILE,
                email: obj.EMAIL,
                ddUserId: obj.ddId,
                //tel:obj.,
                //worksPlace:obj.,
                //remark:obj.,
                gmt_create: this.app.mysql.literals.now,
                gmt_modified: this.app.mysql.literals.now
            });

            if (record) {
                return {
                    code: 200
                }
            } else {
                return {
                    code: 400,
                    message: 'this is error for insert SQL'
                }
            }
        }

        * updateEmployee(obj) {   //update   employee表
            console.log(`执行update表操作`);
            let vo = {};
            Object.assign(vo, {
                position: obj.position,
                name: obj.name,
                mobile: obj.mobile,
                email: obj.email,
                jobNumber: obj.jobNumber,
                gmt_modified: this.app.mysql.literals.now
            });
            let result = yield this.app.mysql.update('employee', vo,{
                where:{
                    jobNumber: obj.jobNumber
                }
            });
            if (result) {
                return {
                    code: 200
                }
            } else {
                code:400
            }
        }

        // TODO 未来获取钉钉工作地点时再启用
        // *getDdUsers() {
        //     let users = yield this.ctx.curl('http://private-service.cathay-ins.com.cn/dd/user', {//获取钉钉的信息
        //         contentType: 'json',
        //         method: 'get'
        //     });
        //
        //     return users;
        // }


        * updateDdUser(obj) {
            let result = yield this.ctx.curl(`${DDURL}/dd/user`, {//update钉钉信息
                contentType: 'json',
                method: 'put',
                dataType: 'json',
                data: {
                    position: obj.position,
                    name: obj.name,
                    mobile: obj.mobile,
                    email: obj.email,
                    userid: obj.ddUserId//钉钉id
                }
            });
        }

    }

    return Users;
}
;