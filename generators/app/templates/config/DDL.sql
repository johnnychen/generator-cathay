/*==============================================================*/
/* Table: employee                                               */
/*==============================================================*/    
CREATE TABLE `employee`
(                                                                     
   `ID`                BIGINT NOT NULL auto_increment COMMENT '员工中心的ID',
   `ddUserId`        VARCHAR(100) not null COMMENT '钉钉用户表中的userid',
   `position`          VARCHAR(64) DEFAULT NULL COMMENT '员工职位，老系统核心',
   `name`              VARCHAR(100) DEFAULT NULL COMMENT '员工姓名，老系统核心',
   `jobNumber`         VARCHAR(100) DEFAULT NULL COMMENT '员工号码，老系统核心',
   `mobile`            VARCHAR(20)  DEFAULT NULL COMMENT '员工号码，钉钉',
   `email`             VARCHAR(64) DEFAULT NULL COMMENT '员工邮箱',
   `tel`               VARCHAR(50)  DEFAULT NULL COMMENT '分机号',
   `workPlace`         VARCHAR(50) DEFAULT NULL COMMENT '办公地点',
   `resigned`           int(1) DEFAULT 0 COMMENT '离职标识，0 在职，1 离职',
   `remark`            VARCHAR(1000) DEFAULT NULL COMMENT '备注',
   `gmt_create`        DATETIME NOT NULL COMMENT '创建时间',
   `gmt_modified`      DATETIME NOT NULL COMMENT '最近修改时间',      
   PRIMARY KEY (`ID`),
   UNIQUE KEY `ID_UNIQUE` (`ID`,`email`,`ddUserId`,`jobNumber`)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='员工表';

