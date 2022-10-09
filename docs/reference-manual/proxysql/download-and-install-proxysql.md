# Download and Install ProxySQL

## 一、添加Repository

1. 通过下面命令添加`repo`文件到`/etc/yum.repos.d/`目录，默认系统为`CentOS 7`

   ```sh{4,6}
   cat <<EOF | tee /etc/yum.repos.d/proxysql.repo
   [proxysql_repo]
   name=ProxySQL YUM repository
   baseurl=https://repo.proxysql.com/ProxySQL/proxysql-2.4.x/centos/7
   gpgcheck=1
   gpgkey=https://repo.proxysql.com/ProxySQL/proxysql-2.4.x/repo_pub_key
   EOF
   ```

2. 如果想要安装`2.3.x`或者`2.2.x`版本，只需要替换上面相应的`baseurl`和`gpgkey`就可以了(高亮的第4行与第6行)。不同版本对应链接如下

   ```sh
   For 2.3.x series releases use https://repo.proxysql.com/ProxySQL/proxysql-2.3.x/centos/7 instead
   For 2.2.x series releases use https://repo.proxysql.com/ProxySQL/proxysql-2.2.x/centos/7 instead
   ```

   

## 二、安装ProxySQL

1. 通过下面命令完成安装:

   ```sh
   yum install proxysql
   ```


2. 查看`proxysql`版本

   ```sh
   proxysql --version
   ```

   ```sh
   ProxySQL version 2.4.4-44-g3b13c7c, codename Truls
   ```



## 三、配置ProxySQL

1. 启动proxysql

   ```sh
   systemctl start proxysql
   ```

2. 配置开机自启动

   ```sh
   systemctl enable proxysql
   ```

3. 查看proxysql状态

   ```sh
   systemctl status proxysql
   ```

   

## 四、访问ProxySQL

1. 通过`admin interface`访问，`--prompt`为自定义提示符，缺省则为`mysql>`

   ```sql
   mysql -u admin -padmin -h 127.0.0.1 -P6032 --prompt='Admin> '
   ```

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



