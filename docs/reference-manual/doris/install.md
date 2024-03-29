# Installation and Deployment

## 一、软硬件需求

1. Linux操作系统版本需求，Doris对CentOS系统版本要求在`7.1及以上`，通过以下命令来查看版本

   ```sh
   cat /etc/redhat-release
   ```

   ```sh
   CentOS Linux release 7.9.2009 (Core)
   ```

2. 软件需求

   1. java版本需要在`1.8及以上`，通过以下命令来查看版本

      ```sh
      java -version
      ```

      ```sh
      java version "1.8.0_181"
      Java(TM) SE Runtime Environment (build 1.8.0_181-b13)
      Java HotSpot(TM) 64-Bit Server VM (build 25.181-b13, mixed mode)
      ```


   2. gcc版本需要在`4.8.2及以上`，通过以下命令来查看版本

      ```sh
      gcc -v
      ```

      ```sh
      ...
      gcc 版本 4.8.5 20150623 (Red Hat 4.8.5-44) (GCC)
      ```

      

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

   

## 二、集群部署

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

      ```sh{5}
      # data root path, separate by ';'
      # you can specify the storage medium of each root path, HDD or SSD
      # you can add capacity limit at the end of each root path, seperate by ','
      # eg:
      storage_root_path = /doris,medium:hdd,capacity:3500;/opt/software/palo-1.0.5/be/storage,medium:ssd,capacity:1800
      # /home/disk1/doris.HDD, capacity limit is 50GB, HDD;
      # /home/disk2/doris.SSD, capacity limit is 1GB, SSD;
      # /home/disk2/doris, capacity limit is disk capacity, HDD(default)
      ```

   2. 在FE中添加所有BE节点

      ```sh
      mysql -u root  -h  192.168.1.10 -P  9030
      ```

      ```sh
      ALTER SYSTEM ADD BACKEND "192.168.1.13:9050";
      ALTER SYSTEM ADD BACKEND "192.168.1.14:9050";
      ALTER SYSTEM ADD BACKEND "192.168.1.15:9050";
      ALTER SYSTEM ADD BACKEND "192.168.1.16:9050";
      ALTER SYSTEM ADD BACKEND "192.168.1.17:9050";
      ```

   3. 启动BE

      ```sh
      bin/start_be.sh --daemon
      ```

   4. 查看BE状态

      ```sql
      mysql -u root -h 192.168.7.* -P 9030
      SHOW PROC '/backends';
      ```

      ```sql
      +-----------+-----------------+---------------+----------+---------------+--------+----------+----------+---------------------+---------------------+-------+----------------------+--------------------
      | BackendId | Cluster         | IP            | HostName | HeartbeatPort | BePort | HttpPort | BrpcPort | LastStartTime       | LastHeartbeat       | Alive | SystemDecommissioned | ClusterDecommission
      +-----------+-----------------+---------------+----------+---------------+--------+----------+----------+---------------------+---------------------+-------+----------------------+--------------------
      | 36728047  | default_cluster | 192.168.1.13 | doris-be-01  | 9050          | 9060   | 8040     | 8060     | 2021-07-15 10:21:42 | 2021-09-16 15:54:29 | true  | false                | false              
      | 36728048  | default_cluster | 192.168.1.14 | doris-be-02  | 9050          | 9060   | 8040     | 8060     | 2021-07-15 10:22:44 | 2021-09-16 15:54:29 | true  | false                | false              
      | 36728049  | default_cluster | 192.168.1.15 | doris-be-03  | 9050          | 9060   | 8040     | 8060     | 2021-07-15 10:23:32 | 2021-09-16 15:54:29 | true  | false                | false              
      | 36728050  | default_cluster | 192.168.1.16 | doris-be-04  | 9050          | 9060   | 8040     | 8060     | 2021-07-15 10:24:12 | 2021-09-16 15:54:29 | true  | false                | false              
      | 36728051  | default_cluster | 192.168.1.17 | doris-be-05  | 9050          | 9060   | 8040     | 8060     | 2021-07-15 10:25:22 | 2021-09-16 15:54:29 | true  | false                | false                         
      +-----------+-----------------+---------------+----------+---------------+--------+----------+----------+---------------------+---------------------+-------+----------------------+--------------------
      5 rows in set (0.00 sec)
      ```

3. FE高可用部署

   1. 通过`ALTER SYSTEM ADD FOLLOWER`命令添加节点

      ```sh
      ALTER SYSTEM ADD FOLLOWER "192.168.1.11:9010";
      ALTER SYSTEM ADD FOLLOWER "192.168.1.12:9010";
      ```

   2. 在所添加节点运行一下命令

      ```sh
      ./bin/start_fe.sh --helper 192.168.1.10:9010 --daemon
      ```



## 三、Root用户登录与密码修改

1. Doris内置root和admin用户，密码默认都为空。登录后，可以通过以下命令修改root密码：

   ```sql
   SET PASSWORD FOR 'root' = PASSWORD('root');
   ```

   



参考链接：[Apache Doris 环境安装部署](https://hf200012.github.io/2021/09/Apache-Doris-%E7%8E%AF%E5%A2%83%E5%AE%89%E8%A3%85%E9%83%A8%E7%BD%B2/)
