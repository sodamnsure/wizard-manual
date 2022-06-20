# 安装准备

## 一、设置主机名

1. 设置主机名

   ```sh
   sudo hostnamectl set-hostname foo-1.example.com
   ```

2. 编辑`/etc/hosts`文件

   ```sh
   1.1.1.1  foo-1.example.com  foo-1
   2.2.2.2  foo-2.example.com  foo-2
   3.3.3.3  foo-3.example.com  foo-3
   4.4.4.4  foo-4.example.com  foo-4
   ```

3. 编辑`/etc/sysconfig/network`

   ```sh
   HOSTNAME=foo-1.example.com
   ```

4. 验证主机标识一致性

   1. 运行`uname -a`命令,检查主机名是否与`hostname`命令的输出结果匹配。

   2. 运行`/sbin/ifconfig`命令，注意`eth`输出结果中的`inet addr`的值，例如

      ```sh
      eth0      Link encap:Ethernet  HWaddr 00:0C:29:A4:E8:97  
                inet addr:172.29.82.176  Bcast:172.29.87.255  Mask:255.255.248.0
      ...
      ```

      

   3. 运行`host -v -t A $(hostname)`命令，验证输出是否与`hostname`命令的输出结果匹配。并且IP地址应该与`ifconfig`命令输出的`inet addr`值相同。

      ```sh
      Trying "foo-1.example.com"
      ...
      ;; ANSWER SECTION:
      foo-1.example.com. 60 IN
      A
      172.29.82.176
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