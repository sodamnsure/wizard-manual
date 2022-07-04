# Installing MySQL on Linux

## 1. 添加MySQL Yum Repository

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



## 2. 选择MySQL5.7版本

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

2. 使用`yum-config-manager`命令启用mysql5.7

   ```sh
   sudo yum-config-manager --disable mysql80-community
   sudo yum-config-manager --enable mysql57-community
   ```

3. 查看启用结果

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

   

## 3. 访问MySQL

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

   



官网参考链接: [Installing MySQL on Linux](https://dev.mysql.com/doc/refman/8.0/en/linux-installation-yum-repo.html)