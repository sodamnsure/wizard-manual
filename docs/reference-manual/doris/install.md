# Installation and Deployment

## 1. 软硬件需求

1. Linux操作系统版本需求

   | Linux系统 | 版本         | 验证命令                  |
   | --------- | ------------ | ------------------------- |
   | CentOS    | 7.1及以上    | `cat /etc/redhat-release` |
   | Ubuntu    | 16.04 及以上 | `cat /etc/redhat-release` |

   

2. 软件需求

   | 软件 | 版本         | 验证命令        |
   | ---- | ------------ | --------------- |
   | java | 1.8 及以上   | `java -version` |
   | gcc  | 4.8.2 及以上 | `gcc -v`        |

3. 文件句柄数

   ```sh
   vi /etc/security/limits.conf 
   * soft nofile 65536
   * hard nofile 65536
   ```

4. 禁用交换分区

   ```sh
   swapoff -a
   ```

   永久关闭交换分区

   ```sh
   vim /etc/fstab
   ```

   注释加载swap分区的那行记录

   重启机器

   ```sh
   reboot
   ```

5. IP绑定

   每台机器编辑`fe.conf`或者`be.conf`文件

   ```sh
   priority_networks=10.1.3.0/24
   ```

   

## 2. 集群部署

1. FE部署

   1. 根据磁盘分布情况指定元数据存放位置，编辑文件`conf/fe.conf`

      ```sh
      vim conf/fe.conf
      ```

      ```sh{10}
      ##
      ## the lowercase properties are read by main program.
      ##
      
      # INFO, WARN, ERROR, FATAL
      sys_log_level = INFO
      
      # store metadata, must be created before start FE.
      # Default value is ${DORIS_HOME}/doris-meta
      meta_dir = ${DORIS_HOME}/doris-meta
      ```

      需要**手动创建该目录**

   2. 调整堆内存

      同样编辑`conf/fe.conf`文件，生产环境建议调整`JAVA_OPTS`为**8G**以上。

      ```sh
      vim conf/fe.conf
      ```

      ```sh{5}
      # the output dir of stderr and stdout
      LOG_DIR = ${DORIS_HOME}/log
      
      DATE = `date +%Y%m%d-%H%M%S`
      JAVA_OPTS="-Xmx8192m -XX:+UseMembar -XX:SurvivorRatio=8 -XX:MaxTenuringThreshold=7 -XX:+PrintGCDateStamps -XX:+PrintGCDetails -XX:+UseConcMarkSweepGC -XX:+UseParNewGC -XX:+CMSClassUnloadingEnabled -XX:-CMSParallelRemarkEnabled -XX:CMSInitiatingOccupancyFraction=80 -XX:SoftRefLRUPolicyMSPerMB=0 -Xloggc:$DORIS_HOME/log/fe.gc.log.$DATE"
      
      # For jdk 9+, this JAVA_OPTS will be used as default JVM options
      JAVA_OPTS_FOR_JDK_9="-Xmx4096m -XX:SurvivorRatio=8 -XX:MaxTenuringThreshold=7 -XX:+CMSClassUnloadingEnabled -XX:-CMSParallelRemarkEnabled -XX:CMSInitiatingOccupancyFraction=80 -XX:SoftRefLRUPolicyMSPerMB=0 -Xlog:gc*:$DORIS_HOME/log/fe.gc.log.$DATE:time"
      ```

   3. 启动FE

      ```sh
      bin/start_fe.sh --daemon
      ```

      通过`ip:8030`访问，用户名：`root`，密码为空。

      或者通过`mysql -u root  -h  ip -P  9030 `访问

      ```sh
      mysql> show proc '/frontends';
      +----------------------------------+---------------+----------+-------------+----------+-----------+---------+----------+----------+------------+------+-------+-------------------+---------------------+----------+--------+-----------------+
      | Name                             | IP            | HostName | EditLogPort | HttpPort | QueryPort | RpcPort | Role     | IsMaster | ClusterId  | Join | Alive | ReplayedJournalId | LastHeartbeat       | IsHelper | ErrMsg | Version         |
      +----------------------------------+---------------+----------+-------------+----------+-----------+---------+----------+----------+------------+------+-------+-------------------+---------------------+----------+--------+-----------------+
      | 192.168.1.10_9010_1605850067231 | 10.220.146.10 | doris-be--fe-01  | 9010        | 8030     | 9030      | 9020    | FOLLOWER | true     | 2113522669 | true | true  | 29778512          | 2021-09-16 14:58:44 | true     |        | 0.14.13-Unknown |
      +----------------------------------+---------------+----------+-------------+----------+-----------+---------+----------+----------+------------+------+-------+-------------------+---------------------+----------+--------+-----------------+
      1 row in set (0.04 sec)
      ```

2. BE部署

   1. 修改`conf/be.conf`文件，配置`storage_root_path`
