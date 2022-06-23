# 安装准备

## 一、设置主机名

1. 设置主机名

   ```sh
   sudo hostnamectl set-hostname monalisa001.wizard.com
   ```

2. 编辑`/etc/hosts`文件

   ```sh
   192.168.7.1  monalisa001.wizard.com  monalisa001
   192.168.7.2  monalisa002.wizard.com  monalisa002
   192.168.7.3  monalisa003.wizard.com  monalisa003
   192.168.7.4  monalisa004.wizard.com  monalisa004
   ```

3. 编辑`/etc/sysconfig/network`

   ```sh
   HOSTNAME=monalisa001.wizard.com
   ```

4. 验证主机标识一致性

   1. 运行`uname -a`命令,检查主机名是否与`hostname`命令的输出结果匹配。

   2. 运行`/sbin/ifconfig`命令，注意`eth`输出结果中的`inet addr`的值，例如

      ```sh
      eth0      Link encap:Ethernet  HWaddr 00:0C:29:A4:E8:97  
                inet addr:192.168.7.1  Bcast:172.29.87.255  Mask:255.255.248.0
      ...
      ```

      

## 二、禁用防火墙

1. 保存防火墙规则

   ```sh
   sudo iptables-save > ~/firewall.rules
   ```

2. 禁用防火墙

   ```sh
   sudo systemctl disable firewalld
   sudo systemctl stop firewalld
   ```



## 三、设置SELinux

1. 检查SELinux状态

   ```sh
   getenforce
   ```

   如果输出为`Permissive`或者`Disabled`,可以跳过这一步操作。

2. 编辑`/etc/selinux/config`,使得`SELINUX=enforcing`变成`SELINUX=permissive`，保存退出。

3. 重启系统或者运行下面命令立即禁用SELinux

   ```sh
   setenforce 0
   ```

4. 在安装CDH完成后，需要重新启动SELinux，通过重新修改`SELINUX=permissive`为`SELINUX=enforcing`。并且运行下面命令立即启用SELinux。

   ```sh
   setenforce 1
   ```

   

## 四、启用NTP服务

在兼容RHEL 7的操作系统的系统上，已经开始默认使用chronyd服务，而不是ntpd服务了。Cloudera优先使用chronyd验证时间是否同步，且由于服务器可以联网，所以这一步骤不在配置。

注：配置路径为`/etc/chrony.conf`，启动命令`systemctl start chronyd`。



## 五、本地安装

1. 配置Local Parcel Repository

   1. 安装`Apache HTTP`服务

      ```sh
      sudo yum install httpd
      ```

   2. 编辑`/etc/httpd/conf/httpd.conf`文件，在`<IfModule mime_module>`模块添加文件支持

      ```sh{8}
      <IfModule mime_module>
          # 省略上方
          #
          # If the AddEncoding directives above are commented-out, then you
          # probably should define those extensions to indicate media types:
          #
          AddType application/x-compress .Z
          AddType application/x-gzip .gz .tgz .parcel
      
          # 省略下方
      </IfModule>
      ```

   3. 启动`Apache HTTP`服务

      ```sh
      sudo systemctl start httpd
      ```

   4. 下载Parcel到Repository

      ```sh
      sudo mkdir -p /var/www/html/cloudera-repos
      sudo wget --recursive --no-parent --no-host-directories https://USERNAME:PASSWORD@archive.cloudera.com/p/cdh6/6.3.2/parcels/ -P /var/www/html/cloudera-repos
      sudo wget --recursive --no-parent --no-host-directories https://USERNAME:PASSWORD@archive.cloudera.com/gplextras6/6.3.2/parcels/ -P /var/www/html/cloudera-repos
      sudo chmod -R ugo+rX /var/www/html/cloudera-repos/cdh6
      sudo chmod -R ugo+rX /var/www/html/cloudera-repos/gplextras6
      ```

   5. 在页面安装页面，选择`Remote Parcel Repository URLs`输入仓库地址:`http://<web_server>/cloudera-parcels/cdh6/6.3.3/`