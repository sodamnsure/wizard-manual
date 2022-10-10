# First steps after installing

## 一、服务管理

当`ProxySQL`软件被安装后，我们可以通过`systemctl`命令来管理进程。

1. 启动`ProxySQL`

   ```sh
   systemctl start proxysql
   ```

2. 停止`ProxySQL`

   ```sh
   systemctl stop proxysql
   ```

3. 重启`ProxySQL`

   ```sh
   systemctl restart proxysql
   ```

4. 查看`ProxySQL`运行状态

   ```sh
   systemctl status proxysql
   ```

5. 从配置文件`/etc/proxysql.cnf`重新初始化`ProxySQL`

   ```sh
   systemctl start proxysql-initial
   ```

   详解启动顺序:

   ```sh
   cat /etc/proxysql.cnf
   ```

   ```sh{13,16,20,29}
   #file proxysql.cfg
   
   ########################################################################################
   # This config file is parsed using libconfig , and its grammar is described in:
   # http://www.hyperrealm.com/libconfig/libconfig_manual.html#Configuration-File-Grammar
   # Grammar is also copied at the end of this file
   ########################################################################################
   
   ########################################################################################
   # IMPORTANT INFORMATION REGARDING THIS CONFIGURATION FILE:
   ########################################################################################
   # On startup, ProxySQL reads its config file (if present) to determine its datadir.
   # What happens next depends on if the database file (disk) is present in the defined
   # datadir (i.e. "/var/lib/proxysql/proxysql.db").
   #
   # If the database file is found, ProxySQL initializes its in-memory configuration from
   # the persisted on-disk database. So, disk configuration gets loaded into memory and
   # then propagated towards the runtime configuration.
   #
   # If the database file is not found and a config file exists, the config file is parsed
   # and its content is loaded into the in-memory database, to then be both saved on-disk
   # database and loaded at runtime.
   #
   # IMPORTANT: If a database file is found, the config file is NOT parsed. In this case
   #            ProxySQL initializes its in-memory configuration from the persisted on-disk
   #            database ONLY. In other words, the configuration found in the proxysql.cnf
   #            file is only used to initial the on-disk database read on the first startup.
   #
   # In order to FORCE a re-initialise of the on-disk database from the configuration file
   # the ProxySQL service should be started with "systemctl start proxysql-initial".
   #
   ########################################################################################
   
   datadir="/var/lib/proxysql"
   errorlog="/var/lib/proxysql/proxysql.log"
   
   略...
   ```

   第一步：配置文件`13`行说明了程序启动时首先会检查存储在`/var/lib/proxysql/`目录下的`proxysql.db`的数据库文件是否存在

   第二步：配置文件`16`说明了如果数据库文件存在，将会加载其中的配置到运行环境中。

   第三步：配置文件`20`行说明了如果数据库文件不存在但是配置文件`/etc/proxysql.cnf`存在，则会按照配置文件进行加载并重新创建数据库文件`proxysql.db`。

   注：如果想要强制按照配置文件进行初始化，需要使用`systemctl start proxysql-initial`命令(配置文件`29`行)。



## 二、检查ProxySQL版本

1. 查看`proxysql`版本

   ```sh
   proxysql --version
   ```

   ```sh
   ProxySQL version 2.4.4-44-g3b13c7c, codename Truls
   ```



## 三、通过admin接口配置ProxySQL

1. 通过`admin interface`访问，`--prompt`为自定义提示符，缺省则为`mysql>`

   ```sh
   mysql: [Warning] Using a password on the command line interface can be insecure.
   Welcome to the MySQL monitor.  Commands end with ; or \g.
   Your MySQL connection id is 1
   Server version: 5.5.30 (ProxySQL Admin Module)
   
   Copyright (c) 2000, 2022, Oracle and/or its affiliates.
   
   Oracle is a registered trademark of Oracle Corporation and/or its
   affiliates. Other names may be trademarks of their respective
   owners.
   
   Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
   
   Admin> show databases;
   +-----+---------------+-------------------------------------+
   | seq | name          | file                                |
   +-----+---------------+-------------------------------------+
   | 0   | main          |                                     |
   | 2   | disk          | /var/lib/proxysql/proxysql.db       |
   | 3   | stats         |                                     |
   | 4   | monitor       |                                     |
   | 5   | stats_history | /var/lib/proxysql/proxysql_stats.db |
   +-----+---------------+-------------------------------------+
   5 rows in set (0.00 sec)
   ```

   注：官网还有通过配置文件配置ProxySQL的介绍，不使用这种方式。



## 四、参考链接

1. 官网链接

   [First steps after installing](https://proxysql.com/documentation/getting-started)
