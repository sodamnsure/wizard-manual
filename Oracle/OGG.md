# OGG

## OGG进程

manager、extract、replicat、collector

Manager：主进程。管理ogg的其他进程，报告错误、分配数据存储、在目标端和源端有且只有一个manager进程。

Extract：运行在数据库源端，负责从源端数据表或者日志中捕获数据。

Pump：运行在数据库源端，其作用将源端产生的本地`trail`文件，以数据块的行为通过`TCP/IP`协议发送到目标端。

Collector：与Pump进程对应的叫做Server Collector进程，对我们来说是透明的。运行在目标端，其任务是把Extract/Pump投递过来的数据重新组装成远程`trail`文件。

Replicat：运行在目标端，叫做应用进程，是数据传递的最后一站，负责读取目标端`trail`文件的内容，并将其解析为`DML/DDL`语句，然后应用到目标数据库中。



