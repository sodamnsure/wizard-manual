# How to configure ProxySQL

## 一、初始配置

1. 首先配置`ProxySQL`的基本组件，通过`mysql`命令行客户端访问`ProxySQL`(需要使用`6032`端口)。

   ```sh
   mysql -u admin -padmin -h 10.10.0.1 -P6032 --prompt 'ProxySQL Admin> '
   ```

   ```sql
   mysql: [Warning] Using a password on the command line interface can be insecure.
   Welcome to the MySQL monitor.  Commands end with ; or \g.
   Your MySQL connection id is 5
   Server version: 5.5.30 (ProxySQL Admin Module)
   
   Copyright (c) 2000, 2022, Oracle and/or its affiliates.
   
   Oracle is a registered trademark of Oracle Corporation and/or its
   affiliates. Other names may be trademarks of their respective
   owners.
   
   Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
   
   ProxySQL Admin>
   ```

2. 检查`mysql_servers`,`mysql_replication_hostgroups`,`mysql_query_rules`是否存有数据来验证配置文件是否为空。

   ```sql
   ProxySQL Admin> SELECT * FROM mysql_servers;
   Empty set (0.00 sec)
   
   ProxySQL Admin> SELECT * from mysql_replication_hostgroups;
   Empty set (0.00 sec)
   
   ProxySQL Admin> SELECT * from mysql_query_rules;
   Empty set (0.00 sec)
   ```

3. 添加后端`backends`

   以`10.0.0.1`,`10.0.0.2`, `10.0.0.3`三台机器为例，将这三台机器信息添加到`mysql_servers`表中。

   ```sql
   ProxySQL Admin> INSERT INTO mysql_servers(hostgroup_id,hostname,port) VALUES (1,'10.0.0.1',3306);
   Query OK, 1 row affected (0.01 sec)
   
   ProxySQL Admin> INSERT INTO mysql_servers(hostgroup_id,hostname,port) VALUES (1,'10.0.0.2',3306);
   Query OK, 1 row affected (0.01 sec)
   
   ProxySQL Admin> INSERT INTO mysql_servers(hostgroup_id,hostname,port) VALUES (1,'10.0.0.3',3306);
   Query OK, 1 row affected (0.00 sec)
   
   ProxySQL Admin> SELECT * FROM mysql_servers;
   +--------------+-----------+------+--------+--------+-------------+-----------------+---------------------+
   | hostgroup_id | hostname  | port | status | weight | compression | max_connections | max_replication_lag |
   +--------------+-----------+------+--------+--------+-------------+-----------------+---------------------+
   | 1            | 10.10.0.1 | 3306 | ONLINE | 1      | 0           | 1000            | 0                   |
   | 1            | 10.10.0.1 | 3306 | ONLINE | 1      | 0           | 1000            | 0                   |
   | 1            | 10.10.0.1 | 3306 | ONLINE | 1      | 0           | 1000            | 0                   |
   +--------------+-----------+------+--------+--------+-------------+-----------------+---------------------+
   3 rows in set (0.00 sec)
   ```

4. 配置监控

   `ProxySQL`需要不断监控后端`backends`来判断服务的健康状态，包括`connect`,`ping`, `read_only`, `replication_lag`等等。这需要`ProxySQL`能够访问`backends`。

   首先在后端`master`节点创建一个用于监控的用户名

   ```sql
   create user monitor@'10.10.0.%' identified by 'monitor';
   grant ADMIN_PRIV on *.* to monitor@'10.10.0.%';
   ```

   刷新权限

   ```sql
   flush privileges;
   ```

   重新回到`ProxySQL`上配置监控用户信息

   ```sql
   ProxySQL Admin> UPDATE global_variables SET variable_value='monitor' WHERE variable_name='mysql-monitor_username';
   Query OK, 1 row affected (0.00 sec)
   
   ProxySQL Admin> UPDATE global_variables SET variable_value='monitor' WHERE variable_name='mysql-monitor_password';
   Query OK, 1 row affected (0.00 sec)
   ```

   然后配置监控间隔

   ```sql
   ProxySQL Admin> UPDATE global_variables SET variable_value='2000' WHERE variable_name IN ('mysql-monitor_connect_interval','mysql-monitor_ping_interval','mysql-monitor_read_only_interval');
   Query OK, 3 rows affected (0.00 sec)
   
   ProxySQL Admin> SELECT * FROM global_variables WHERE variable_name LIKE 'mysql-monitor_%';
   +----------------------------------------+---------------------------------------------------+
   | variable_name                          | variable_value                                    |
   +----------------------------------------+---------------------------------------------------+
   | mysql-monitor_history                  | 600000                                            |
   | mysql-monitor_connect_interval         | 2000                                              |
   | mysql-monitor_connect_timeout          | 200                                               |
   | mysql-monitor_ping_interval            | 2000                                              |
   | mysql-monitor_ping_timeout             | 100                                               |
   | mysql-monitor_read_only_interval       | 2000                                              |
   | mysql-monitor_read_only_timeout        | 100                                               |
   | mysql-monitor_replication_lag_interval | 10000                                             |
   | mysql-monitor_replication_lag_timeout  | 1000                                              |
   | mysql-monitor_username                 | monitor                                           |
   | mysql-monitor_password                 | monitor                                           |
   | mysql-monitor_query_variables          | SELECT * FROM INFORMATION_SCHEMA.GLOBAL_VARIABLES |
   | mysql-monitor_query_status             | SELECT * FROM INFORMATION_SCHEMA.GLOBAL_STATUS    |
   | mysql-monitor_query_interval           | 60000                                             |
   | mysql-monitor_query_timeout            | 100                                               |
   | mysql-monitor_timer_cached             | true                                              |
   | mysql-monitor_writer_is_also_reader    | true                                              |
   +----------------------------------------+---------------------------------------------------+
   17 rows in set (0.00 sec)
   ```

   注：刷新配置到运行环境和磁盘

   ```sql
   ProxySQL Admin> LOAD MYSQL VARIABLES TO RUNTIME;
   Query OK, 0 rows affected (0.00 sec)
   
   ProxySQL Admin> SAVE MYSQL VARIABLES TO DISK;
   Query OK, 0 rows affected (0.02 sec)
   ```

5. 监控情况查看

   一旦上述配置完成后，将在`monitor`数据库看到具体的后端运行情况。

   ```sql
   ProxySQL Admin> SHOW TABLES FROM monitor;
   +----------------------------------+
   | tables                           |
   +----------------------------------+
   | mysql_server_connect             |
   | mysql_server_connect_log         |
   | mysql_server_ping                |
   | mysql_server_ping_log            |
   | mysql_server_read_only_log       |
   | mysql_server_replication_lag_log |
   +----------------------------------+
   6 rows in set (0.00 sec)
   ```

   可以看到`ProxySQL`监控四种指标：connect、ping、read_only和replication lag。

   ```sql
   1. connect监控
   ProxySQL连接到各后端是否成功，成功/失败的连接将记录到mysql_server_connect_log表中。
   
   2. ping监控
   这是一种心跳检测。Monitor模块向所有后端MySQL节点发起ping检查，ping成功/失败的情况将记录到mysql_server_ping_log表中。
   
   3. read_only监控
   检查mysql_servers表中所有节点的read_only值，并记录到mysql_server_read_only_log表。
   如果read_only=1，表示只读，是一个slave，这样的节点将会自动移入reader_hostgroup中，
   如果read_only=0，表示可写，可能是master，这样的节点将会自动移入writer_hostgroup中。
   
   4. replication lag监控
   对mysql_servers表中所有配置了max_replication_lag的后端slave节点都检查复制延迟，并记录到mysql_server_replication_lag_log表中。
   ```

   第4步`配置监控`实际上就完成了`connect`和`ping`监控，可以通过下面命令查看监控情况。

   ```sql
   ProxySQL Admin> SELECT * FROM monitor.mysql_server_connect_log ORDER BY time_start_us DESC LIMIT 3;
   +-----------+------+------------------+----------------------+---------------+
   | hostname  | port | time_start_us    | connect_success_time | connect_error |
   +-----------+------+------------------+----------------------+---------------+
   | 10.10.0.1 | 3306 | 1456968814253432 | 562                  | NULL          |
   | 10.10.0.2 | 3306 | 1456968814253432 | 309                  | NULL          |
   | 10.10.0.3 | 3306 | 1456968814253432 | 154                  | NULL          |
   +-----------+------+------------------+----------------------+---------------+
   3 rows in set (0.00 sec)
   
   ProxySQL Admin> SELECT * FROM monitor.mysql_server_ping_log ORDER BY time_start_us DESC LIMIT 3;
   +-----------+------+------------------+-------------------+------------+
   | hostname  | port | time_start_us    | ping_success_time | ping_error |
   +-----------+------+------------------+-------------------+------------+
   | 10.10.0.1 | 3306 | 1456968828686787 | 124               | NULL       |
   | 10.10.0.2 | 3306 | 1456968828686787 | 62                | NULL       |
   | 10.10.0.3 | 3306 | 1456968828686787 | 57                | NULL       |
   +-----------+------+------------------+-------------------+------------+
   3 rows in set (0.01 sec)
   ```



## 二、Replication Hostgroups



## 三、参考链接

1. 官网链接

   [How to configure ProxySQL for the first time](https://proxysql.com/documentation/ProxySQL-Configuration/)

2. CNBlogs

   [MySQL中间件值ProxySQL(6)：管理后端节点](https://www.cnblogs.com/f-ck-need-u/p/9286922.html)
