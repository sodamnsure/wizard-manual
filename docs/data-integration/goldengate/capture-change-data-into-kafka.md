# Capture Change Data into Kafka

本文将讲解捕获`Oracle`中多张`Table`的实时变化数据发送到`Kakfa`中不同`Topic`的特定`Partition`中。

## 一、环境要求

1. 目标端版本和源端Oracle GoldenGate保持一致，或者高于源端OGG版本，推荐使用最新版本。
2. [源端官网下载地址](https://edelivery.oracle.com/osdc/faces/SoftwareDelivery)，搜索`Oracle GoldenGate`下载对应版本(本文使用的是` 11.2.1.0.0`版本)即可。
3. [目标端官网下载地址](https://edelivery.oracle.com/osdc/faces/SoftwareDelivery)，搜索`Oracle GoldenGate for Big Data`下载对应版本(本文使用的是`12.3.2.1.0`版本)即可。

## 二、Oracle环境配置

1. 通过如下命令查询是否开启归档：归档日志(Archive Log)是非活动的重做日志备份.通过使用归档日志,可以保留所有重做历史记录。

   ```sql{12}
   [oracle@monalisa ~]$ sqlplus / as sysdba
   
   SQL*Plus: Release 11.2.0.4.0 Production on 星期四 8月 11 13:41:31 2022
   
   Copyright (c) 1982, 2013, Oracle.  All rights reserved.
   
   
   Connected to:
   Oracle Database 11g Enterprise Edition Release 11.2.0.4.0 - 64bit Production
   With the Partitioning, OLAP, Data Mining and Real Application Testing options
   
   SQL> archive log list; 
   Database log mode              No Archive Mode
   Automatic archival             Disabled
   Archive destination            USE_DB_RECOVERY_FILE_DEST
   Oldest online log sequence     1124
   Current log sequence           1126
   ```

   可以看到`Automatic archival`为`Disabled`状态，即数据库未开启归档，接下来通过下面命令开启归档。

   ```sql
   shutdown immediate; --立即关闭数据库
   startup mount; --启动实例并加载数据库
   alter database archivelog; --更改数据库为归档模式
   alter database open; --打开数据库
   alter system archive log start; --启用自动归档
   ```

   再次查询归档情况

   ```sql
   SQL> archive log list; 
   Database log mode              Archive Mode
   Automatic archival             Enabled
   Archive destination            USE_DB_RECOVERY_FILE_DEST
   Oldest online log sequence     1124
   Next log sequence to archive   1126
   Current log sequence           1126
   ```

2. 通过如下命令查询是否开启附加日志：OGG基于辅助日志等进行实时传输，故需要打开相关日志确保可获取事务内容。

   ```sql
   SQL> select force_logging, supplemental_log_data_min from v$database;
   FORCE_LOG SUPPLEMENTAL_LOG_DATA_MI
   --------- ------------------------
   NO	      NO
   ```

   注：`Oracle`附加日志分为两个等级：数据库级别和表级别，在这里我们只要开启数据库级别的`SUPPLEMENTAL_LOG_DATA_MI(最小附加日志)`志即可。

   ```sql
   SQL> alter database add supplemental log data;
   Database altered.
   SQL> select force_logging, supplemental_log_data_min from v$database;
   FORCE_LOG SUPPLEMENTAL_LOG_DATA_MI
   --------- ------------------------
   NO	      YES
   ```

   因为实时数据需要全部字段的变更记录，所以需要开启表级别的`全体字段补充日志`。这里假设我们采集的表为用户`cdc`下的`test1`与`test2`两个表。

   ```sql
   alter table cdc.test1 add supplemental log data(all) columns;
   alter table cdc.test2 add supplemental log data(all) columns;
   ```

3. 创建专门用于OGG传输的用户

   ```sh
   mkdir -p /u01/app/oracle/oggdata/orcl
   chown -R oracle:oinstall /u01/app/oracle/oggdata/orcl
   ```

   以`dba`用户登录，创建以`oggtbs`命令的表空间与所属用户`ogg`，密码也是`ogg`，并赋予`dba`权限。

   ```sql
   SQL> create tablespace oggtbs datafile '/u01/app/oracle/oggdata/orcl/oggtbs01.dbf' size 1000M autoextend on;
   SQL> create user ogg identified by ogg default tablespace oggtbs;
   SQL> grant dba to ogg;
   ```

   至此，`Oracle`配置已经完成。

## 三、源端配置

1. 配置源端`manager`进程：进入GoldenGate目录，创建工作区目录：

   ```sh{11}
   [oracle@monalisa ogg]$ ggsci
   
   Oracle GoldenGate Command Interpreter for Oracle
   Version 11.2.1.0.16 17781910 18008261_FBO
   Linux, x64, 64bit (optimized), Oracle 11g on Dec 30 2013 11:32:14
   
   Copyright (C) 1995, 2013, Oracle and/or its affiliates. All rights reserved.
   
   
   
   GGSCI (monalisa) 1> create subdirs
   
   Creating subdirectories under current directory /DATABASE/u01/ogg
   
   Parameter files                /DATABASE/u01/ogg/dirprm: created.
   Report files                   /DATABASE/u01/ogg/dirrpt: created.
   Checkpoint files               /DATABASE/u01/ogg/dirchk: created.
   Process status files           /DATABASE/u01/ogg/dirpcs: created.
   SQL script files               /DATABASE/u01/ogg/dirsql: created.
   Database definitions files      /DATABASE/u01/ogg/dirdef: created.
   Extract data files             /DATABASE/u01/ogg/dirdat: created.
   Temporary files                /DATABASE/u01/ogg/dirtmp: created.
   Stdout files                   /DATABASE/u01/ogg/dirout: created.
   ```

2. 配置管理器`mgr`：

   ```sh
   GGSCI (monalisa) 2> edit params mgr
   # 添加如下内容
   port 7810
   DYNAMICPORTLIST 7840-7850
   AUTORESTART REPLICAT *, RETRIES 3, WAITMINUTES 5, RESETMINUTES 60
   PURGEOLDEXTRACTS ./dirdat/*,usecheckpoints, minkeepdays 1
   lagreporthours 1
   laginfominutes 30
   lagcriticalminutes 45
   # 保存退出
   ```

   参数解释：

   ```sh
   port 7810
   通信端口7809，source db和target db需要保持一致。
   
   DYNAMICPORTLIST 7840-7850
   动态端口列表的范围从7840到7850。当制定端口被占用或者出现通信故障，管理进程将会从列表中选择下一个端口尝试连接，避免通信端口的单点故障。
   
   AUTORESTART EXTRACT *, RETRIES 3, WAITMINUTES 5, RESETMINUTES 60
   当提取进程中断后尝试自动重启，每隔5分钟尝试启动一次，尝试3次，以后每60分钟清零，再按照每5分钟尝试一次，尝试3次。
   
   PURGEOLDEXTRACTS ./dirdat/*,usecheckpoints, minkeepdays 1
   定期清理dirdat路径下的本地队列（local trail）。保留期限1天，过期后自动删除。从而控制队列文件的目录不会增长过大。
   
   lagreporthours 1
   每隔一小时检查一次传输延迟情况
   
   laginfominutes 30
   传输延时超过30分钟将写入错误日志
   
   lagcriticalminutes 45
   传输延时超过45分钟将写入警告日志
   ```

3. 连接`Oracle`数据库，对需要的表添加`trandata`：

   ```sh
   GGSCI (monalisa) 3> dblogin userid ogg password ogg
   Successfully logged into database.
   
   GGSCI (monalisa) 4> add trandata cdc.test1
   
   Logging of supplemental redo data enabled for table CDC.TEST1.
   GGSCI (monalisa) 5> add trandata cdc.test2
   
   Logging of supplemental redo data enabled for table CDC.TEST2.
   ```

4. 配置`extract`进程

   ```sh
   GGSCI (monalisa) 6> edit param extkafka
   
   # 添加如下内容
   extract extkafka
   dynamicresolution
   SETENV (ORACLE_SID = "cdc")
   SETENV (NLS_LANG = "american_america.AL32UTF8")
   userid ogg,password ogg
   exttrail /DATABASE/u01/ogg/dirdat/ws
   GETUPDATES
   GETUPDATEBEFORES
   NOCOMPRESSDELETES
   NOCOMPRESSUPDATES
   table cdc.test1;
   table cdc.test2;
   # 保存退出
   ```

   参数解释

   ```sh
   dynamicresolution
   有时候开启OGG进程的时候较慢，可能是因为需要同步的表太多，OGG在开启进程之前会将需要同步的表建立一个记录并且存入到磁盘中，这样就需要耗费大量的时间。使用该参数来解决此问题。
   
   SETENV (ORACLE_SID = "cdc")
   如果系统中存在多个数据库有时候会用参数SETENV设置ORACLE_HOME、ORACLE_SID等。
   
   SETENV (NLS_LANG = "american_america.AL32UTF8")
   设置字符集环境变量为UTF8
   
   userid ogg,password ogg
   即OGG连接Oracle数据库的帐号密码
   
   exttrail /DATABASE/u01/ogg/dirdat/ws
   exttrail定义trail文件的保存位置以及文件名，文件名只能是2个字母
   
   GETUPDATES
   GETUPDATEBEFORES
   NOCOMPRESSDELETES
   NOCOMPRESSUPDATES
   上面四个参数是为了保证不管更新还是删除操作，都会将before和after后的字段都显示出来。
   ```

   添加`extract`进程

   ```sh
   GGSCI (monalisa) 7> add extract extkafka,tranlog,begin now
   EXTRACT added.
   ```

   添加`trail`文件的定义与`extract`进程绑定:

   ```sh
   add exttrail /DATABASE/u01/ogg/dirdat/ws,extract extkafka
   ```

5. 配置`pump`进程: 

   ```sh
   # pump进程本质上来说也是一个extract，只不过他的作用仅仅是把trail文件传递到目标端，配置过程和extract进程类似，只是逻辑上称之为pump进程
   GGSCI (monalisa) 8> edit param pukafka
   
   # 添加如下内容
   extract pukafka
   passthru
   dynamicresolution
   userid ogg,password ogg
   rmthost 192.168.7.51 mgrport 7809
   rmttrail /opt/software/ogg_kafka/dirdat/ws
   table cdc.test1;
   table cdc.test2;
   # 保存退出
   ```

   参数解释

   ```sh
   passthru
   禁止OGG与Oracle交互
   
   dynamicresolution
   同extract进程
   
   userid ogg,password ogg
   同extract进程
   
   rmthost 192.168.7.51 mgrport 7809
   rmthost即目标端(kafka)OGG的mgr服务的地址以及监听端口
   
   rmttrail /opt/software/ogg_kafka/dirdat/ws
   目标端trail文件存储位置以及名称
   ```

   分别将本地`trail`文件和目标端的`trail`文件绑定到`extract`进程：

   ```sh
   GGSCI (monalisa) 9> add extract pukafka,exttrailsource /DATABASE/u01/ogg/dirdat/ws
   EXTRACT added.
   GGSCI (monalisa) 10> add rmttrail /opt/software/ogg_kafka/dirdat/ws,extract pukafka
   RMTTRAIL added.
   ```

6. 配置`define`文件

   ```sh
   # Oracle与MySQL，Hadoop集群（HDFS，Hive，kafka等）等之间数据传输可以定义为异构数据类型的传输，故需要定义表之间的关系映射，在OGG命令行执行：
   GGSCI (monalisa) 11> edit param test
   
   # 添加如下内容
   defsfile /opt/ogg/dirdef/cdc.test
   userid ogg,password ogg
   table cdc.test1;
   table cdc.test2;
   # 保存退出
   ```

   `Ctrl+D`退出，此时仍在GoldenGate目录，运行如下命令

   ```sh
   [oracle@monalisa ogg]$ ./defgen paramfile dirprm/test.prm
   
   ***********************************************************************
           Oracle GoldenGate Table Definition Generator for Oracle
                    Version 11.2.1.0.16 17781910 18008261
      Linux, x64, 64bit (optimized), Oracle 11g on Dec 30 2013 10:50:56
   
   Copyright (C) 1995, 2013, Oracle and/or its affiliates. All rights reserved.
   
   
                       Starting at 2022-08-11 15:29:12
   ***********************************************************************
   
   Operating System Version:
   Linux
   Version #1 SMP Wed May 18 16:02:34 UTC 2022, Release 3.10.0-1160.66.1.el7.x86_64
   Node: monalisa106
   Machine: x86_64
                            soft limit   hard limit
   Address Space Size   :    unlimited    unlimited
   Heap Size            :    unlimited    unlimited
   File Size            :    unlimited    unlimited
   CPU Time             :    unlimited    unlimited
   
   Process id: 22146
   
   ***********************************************************************
   **            Running with the following parameters                  **
   ***********************************************************************
   defsfile /DATABASE/u01/ogg/dirdef/cdc.test
   userid ogg,password ********
   table cdc.TEST1;
   Retrieving definition for CDC.TEST1
   
   table ldata.test2;
   Retrieving definition for CDC.TEST2
   
   
   
   Definitions generated for 2 tables in /DATABASE/u01/ogg/dirdef/cdc.test
   ```

   将生成的`/DATABASE/u01/ogg/dirdef/cdc.test`传输到目标端OGG目录下的`dirdef`里面。

   ```sh
   scp -r /DATABASE/u01/ogg/dirdef/cdc.test root@uranus:/opt/software/ogg_kafka/dirdef/
   ```

## 四、目标端配置

1. 配置源端`manager`进程：进入GoldenGate目录，创建工作区目录：

   ```sh{13}
   [root@uranus ogg_kafka]# ggsci
   
   Oracle GoldenGate for Big Data
   Version 12.3.2.1.1 (Build 005)
   
   Oracle GoldenGate Command Interpreter
   Version 12.3.0.1.2 OGGCORE_OGGADP.12.3.0.1.2_PLATFORMS_180712.2305
   Linux, x64, 64bit (optimized), Generic on Jul 13 2018 00:46:09
   Operating system character set identified as UTF-8.
   
   Copyright (C) 1995, 2018, Oracle and/or its affiliates. All rights reserved.
   
   GGSCI (uranus) 1> create subdirs
   
   Creating subdirectories under current directory /opt/software/ogg_kafka
   
   Parameter file                 /opt/software/ogg_kafka/dirprm: created.
   Report file                    /opt/software/ogg_kafka/dirrpt: created.
   Checkpoint file                /opt/software/ogg_kafka/dirchk: created.
   Process status files           /opt/software/ogg_kafka/dirpcs: created.
   SQL script files               /opt/software/ogg_kafka/dirsql: created.
   Database definitions files      /opt/software/ogg_kafka/dirdef: created.
   Extract data files             /opt/software/ogg_kafka/dirdat: created.
   Temporary files                /opt/software/ogg_kafka/dirtmp: created.
   Credential store files         /opt/software/ogg_kafka/dircrd: created.
   Masterkey wallet files         /opt/software/ogg_kafka/dirwlt: created.
   Dump files                     /opt/software/ogg_kafka/dirdmp: created.
   ```

2. 配置管理器`mgr`：

   ```sh
   GGSCI (uranus) 2> edit params mgr
   
   # 添加如下内容
   PORT 7809
   DYNAMICPORTLIST 7810-7819
   AUTORESTART REPLICAT *, RETRIES 3, WAITMINUTES 5, RESETMINUTES 60
   PURGEOLDEXTRACTS ./dirdat/*,usecheckpoints, minkeepdays 1
   lagreporthours 1
   laginfominutes 30
   lagcriticalminutes 45
   # 保存退出
   ```

3. 配置`checkpoint`

   ```sh
   GGSCI (uranus) 3> edit  param  ./GLOBALS
   
   # 添加如下内容
   CHECKPOINTTABLE test_ogg.checkpoint
   # 保存退出
   ```

4. 配置`replicate`进程

   ```sh
   GGSCI (uranus) 4> edit param rekafka
   
   # 添加如下内容
   REPLICAT rekafka
   sourcedefs /opt/software/ogg_kafka/dirdef/cdc.test
   TARGETDB LIBFILE libggjava.so SET property=dirprm/kafka.props
   REPORTCOUNT EVERY 1 MINUTES, RATE 
   GROUPTRANSOPS 10000
   MAP cdc.TEST1, TARGET cdc.TEST1;
   MAP cdc.TEST2, TARGET cdc.TEST2;
   # 保存退出
   ```

   参数解释：

   ```sh
   sourcedefs /opt/software/ogg_kafka/dirdef/cdc.test
   源端生成的表映射文件
   
   TARGETDB LIBFILE libggjava.so SET property=dirprm/kafka.props
   定义kafka一些适配性的库文件以及配置文件，配置文件位于OGG主目录下的dirprm/kafka.props
   
   REPORTCOUNT EVERY 1 MINUTES, RATE 
   每隔1分钟报告一次从程序开始到现在的抽取进程或者复制进程的事物记录数，并汇报进程的统计信息
   
   GROUPTRANSOPS 10000
   以事务传输时，事务合并的单位，减少IO操作
   
   MAP cdc.TEST1, TARGET cdc.TEST1;
   MAP cdc.TEST2, TARGET cdc.TEST2;
   源端与目标端的映射关系
   ```

5. 配置`kafka.props`：

   ```sh
   cd /opt/software/ogg_kafka/dirprm
   vim kafka.props
   ```

   ```sh{4,5}
   gg.handlerlist=kafkahandler
   gg.handler.kafkahandler.type=kafka
   gg.handler.kafkahandler.KafkaProducerConfigFile=custom_kafka_producer.properties
   gg.handler.kafkahandler.topicMappingTemplate=ODS_${tableName}_DELTA
   gg.handler.kafkahandler.keyMappingTemplate=${primaryKeys}
   gg.handler.kafkahandler.format=json
   gg.handler.kafkahandler.mode=op
   gg.classpath=dirprm/:/opt/software/ogg_lib/libs/*:/opt/software/ogg_kafka/:/opt/software/ogg_kafka/lib/*
   
   
   gg.log=log4j
   gg.log.level=INFO
   
   gg.report.time=30sec
   ```

   参数解释：

   `gg.handler.kafkahandler.topicMappingTemplate`：将不同表的数据发送到不同的Topic中。

   `gg.handler.kafkahandler.keyMappingTemplate`：将同一张表的数据发送到Topic的不同分区中。

   参考链接：[Using the Kafka Handler](https://docs.oracle.com/en/middleware/goldengate/big-data/19.1/gadbd/using-kafka-handler.html)

6. 配置`custom_kafka_producer.properties`

   ```sh
   vim custom_kafka_producer.properties
   ```

   ```sh
   bootstrap.servers=192.168.7.51:9092
   acks=1
   compression.type=gzip
   reconnect.backoff.ms=1000
   value.serializer=org.apache.kafka.common.serialization.ByteArraySerializer
   key.serializer=org.apache.kafka.common.serialization.ByteArraySerializer
   batch.size=102400
   linger.ms=10000
   partitioner.class=com.easypay.kafka.ProducerPartitioner
   ```



## 五、启动所有进程

1. 源端启动

   ```sh
   start mgr
   start extkafka
   start pukafka
   ```

2. 目标端启动

   ```sh
   start mgr
   start rekafka
   ```

   注：`Kafka`中如果不创建的对应的`Topic`名称并且没有关闭自动创建权限的话，`OGG`会自动创建`Topic`。



## 六、Reference

1. [利用ogg实现oracle到kafka的增量数据实时同步](https://dongkelun.com/2018/05/23/oggOracle2Kafka/)
2. [OGG for Big Data](https://help.aliyun.com/document_detail/193506.html)
3. [Using the Kafka Handler](https://docs.oracle.com/en/middleware/goldengate/big-data/19.1/gadbd/using-kafka-handler.html#GUID-2561CA12-9BAC-454B-A2E3-2D36C5C60EE5)
4. [浅谈Oracle归档日志](https://www.jianshu.com/p/4d8dd25267d9)
5. [ogg oracle到oracle支持DDL复制配置](https://www.jianshu.com/p/8ac056bfe2b2)