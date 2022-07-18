# Installing MySQL on Linux

## 一、添加MySQL Yum Repository

1. 访问[MySQL Yum Repository](https://dev.mysql.com/downloads/repo/yum/)页面，下载适配`Red Hat Enterprise Linux 7 / Oracle Linux 7`系统的`rpm`文件`mysql80-community-release-el7-6.noarch.rpm`。

2. 安装`rpm`package

   ```sh
   sudo yum install mysql80-community-release-el7-6.noarch.rpm
   ```

   安装成功后会在`/etc/yum.repos.d`目录下生成`repo`文件

   ```sh
   cd /etc/yum.repos.d
   tree -C -L 1
   ```

   ```sh
   .
   ├── CentOS-Base.repo
   ├── epel.repo
   ├── mysql-community-debuginfo.repo
   ├── mysql-community.repo
   └── mysql-community-source.repo
   ```



## 二、选择MySQL5.7版本

1. 查看所有`MySQL Yum repository`中所有的`subrepositories`

   ```sh
   yum repolist all | grep mysql
   ```

   ```sh
   mysql-cluster-7.5-community/x86_64           MySQL Cluster 7.5 Comm 禁用
   mysql-cluster-7.5-community-source           MySQL Cluster 7.5 Comm 禁用
   mysql-cluster-7.6-community/x86_64           MySQL Cluster 7.6 Comm 禁用
   mysql-cluster-7.6-community-source           MySQL Cluster 7.6 Comm 禁用
   mysql-cluster-8.0-community/x86_64           MySQL Cluster 8.0 Comm 禁用
   mysql-cluster-8.0-community-debuginfo/x86_64 MySQL Cluster 8.0 Comm 禁用
   mysql-cluster-8.0-community-source           MySQL Cluster 8.0 Comm 禁用
   mysql-connectors-community/x86_64            MySQL Connectors Commu 启用:    192
   mysql-connectors-community-debuginfo/x86_64  MySQL Connectors Commu 禁用
   mysql-connectors-community-source            MySQL Connectors Commu 禁用
   mysql-tools-community/x86_64                 MySQL Tools Community  启用:     90
   mysql-tools-community-debuginfo/x86_64       MySQL Tools Community  禁用
   mysql-tools-community-source                 MySQL Tools Community  禁用
   mysql-tools-preview/x86_64                   MySQL Tools Preview    禁用
   mysql-tools-preview-source                   MySQL Tools Preview -  禁用
   mysql57-community/x86_64                     MySQL 5.7 Community Se 禁用
   mysql57-community-source                     MySQL 5.7 Community Se 禁用
   mysql80-community/x86_64                     MySQL 8.0 Community Se 启用:    343
   mysql80-community-debuginfo/x86_64           MySQL 8.0 Community Se 禁用
   mysql80-community-source                     MySQL 8.0 Community Se 禁用
   ```

2. 安装`yum-utils`包，使得可以使用`yum-config-manager`命令管理资源库

   ```sh
   sudo yum -y install yum-utils
   ```

3. 使用`yum-config-manager`命令启用mysql5.7

   ```sh
   sudo yum-config-manager --disable mysql80-community
   sudo yum-config-manager --enable mysql57-community
   ```

4. 查看启用结果

   ```sh
   yum repolist enabled | grep mysql
   ```

   ```sh
   mysql-connectors-community/x86_64 MySQL Connectors Community                 192
   mysql-tools-community/x86_64      MySQL Tools Community                       90
   mysql57-community/x86_64          MySQL 5.7 Community Server                 584
   ```

4. 安装MySQL

   ```sh
   sudo yum install mysql-community-server --nogpgcheck
   ```

5. 启动服务并查看运行情况

   ```sh
   systemctl start mysqld
   systemctl status mysqld
   ```

   

## 三、访问MySQL

1. 获取初始密码

   ```sh
   sudo grep 'temporary password' /var/log/mysqld.log
   ```

   ```sh
   2022-07-04T03:04:35.503644Z 1 [Note] A temporary password is generated for root@localhost: %,A.=4K.fkCY
   ```

   其中`%,A.=4K.fkCY`就是MySQL登录的初始密码，复制即可

2. 登录MySQL

   ```sh
   mysql -uroot -p
   ```

   输入初始密码`%,A.=4K.fkCY`登录

3. 修改登录密码

   ```sh
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';
   flush privileges;
   ```

   

## 四、修改简单密码

1. 查看`validate_password`变量

   ```sql
   SHOW VARIABLES LIKE 'validate_password%';
   ```

   ```sql
   +--------------------------------------+--------+
   | Variable_name                        | Value  |
   +--------------------------------------+--------+
   | validate_password_check_user_name    | OFF    |
   | validate_password_dictionary_file    |        |
   | validate_password_length             | 8      |
   | validate_password_mixed_case_count   | 1      |
   | validate_password_number_count       | 1      |
   | validate_password_policy             | MEDIUM |
   | validate_password_special_char_count | 1      |
   +--------------------------------------+--------+
   ```

2. 修改`validate_password_length`和`validate_password_policy`值

   ```sql
   -- 密码最小长度
   set global validate_password_length=4;
   -- 密码强度检查等级
   set global validate_password_policy=0;
   -- 刷新
   flush privileges;
   ```

3. 修改密码

   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';
   flush privileges;
   ```


## 五、开启用户远程连接

1. 这里以root用户为例，登录MySQL的`mysql`数据库，查询`user`表，查看当前用户是否支持远程连接

   ```sql
   use mysql;
   select user, authentication_string, host from user;
   ```

   ```sql
   mysql> show databases;
   +--------------------+
   | Database           |
   +--------------------+
   | information_schema |
   | mysql              |
   | performance_schema |
   | sys                |
   +--------------------+
   4 rows in set (0.00 sec)
   
   mysql> use mysql;
   Database changed
   mysql> select user, authentication_string, host from user;
   +---------------+-------------------------------------------+-----------+
   | user          | authentication_string                     | host      |
   +---------------+-------------------------------------------+-----------+
   | root          | *032197AE5731D4664921A6CCAC7CFCE6A0698693 | localhost |
   | mysql.session | *THISISNOTAVALIDPASSWORDTHATCANBEUSEDHERE | localhost |
   | mysql.sys     | *THISISNOTAVALIDPASSWORDTHATCANBEUSEDHERE | localhost |
   +---------------+-------------------------------------------+-----------+
   3 rows in set (0.00 sec)
   ```

2. 运行下面命令，开启远程连接，其中123456为连接密码，%为任意主机，就是任意主机可以通过用户名`root`+密码`123456` 进行连接。

   ```sql
   GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '123456';
   ```

   重新加载用户权限使得理解生效

   ```sql
   flush privileges;
   ```

   重新查看`user`表，可以查看`host`发生了变更，此时就可以远程访问了。

   ```sql
   mysql> select user, authentication_string, host from user;
   +---------------+-------------------------------------------+-----------+
   | user          | authentication_string                     | host      |
   +---------------+-------------------------------------------+-----------+
   | root          | *032197AE5731D4664921A6CCAC7CFCE6A0698693 | %         |
   | mysql.session | *THISISNOTAVALIDPASSWORDTHATCANBEUSEDHERE | localhost |
   | mysql.sys     | *THISISNOTAVALIDPASSWORDTHATCANBEUSEDHERE | localhost |
   +---------------+-------------------------------------------+-----------+
   3 rows in set (0.00 sec)
   ```

   注：**如果还是无法连接，检查是否防火墙屏蔽了mysql端口的远程访问权限**。

官网参考链接: [Installing MySQL on Linux](https://dev.mysql.com/doc/refman/8.0/en/linux-installation-yum-repo.html)