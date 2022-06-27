# System Requirements

## 1.软件依赖

1. Cloudera Manager、Cloudera Manager Agent组件依赖

   | 组件                   | 版本         | 查看命令                 |
   | :--------------------- | ------------ | ------------------------ |
   | Cloudera Manager       | Python 2.7   | `python -V`              |
   | Cloudera Manager       | Perl         | `perl -version`          |
   | Cloudera Manager Agent | iproute-3.10 | `rpm -qa | grep iproute` |

2. Spark、Hue组件依赖

   | 组件     | 版本                          | 查看命令    |
   | :------- | ----------------------------- | ----------- |
   | Hue      | Python 2.7                    | `python -V` |
   | Spark2.4 | Python 2.7 and 3.4-3.7        | `python -V` |
   | Spark3.0 | Python 2.7 and 3.4 and higher | `python -V` |
   | Spark3.1 | Python 3.6 and higher         | `python -V` |

## 2.操作系统

1. CDH6.3.x 对Centos操作系统版本要求：7.9, 7.8, 7.7, 7.6, 7.5, 7.4, 7.3, 7.2, 6.10, 6.9

   ```sh
   cat /etc/redhat-release
   ```

2. CDH6.2.x 对Centos操作系统版本要求：7.9, 7.8, 7.7, 7.6, 7.5, 7.4, 7.3, 7.2, 6.10, 6.9, 6.8

   ```sh
   cat /etc/redhat-release
   ```

## 3.文件系统

1. Supported Filesystems: 

   CDH需要文件系统类型为ext3, ext4, XFS, S3中的一个，通过 df -Th命令查看当前文件系统

   ```sh
   df -Th
   ```

2. File Access Time: 

   1. 不更新文件的access时间，提高磁盘IO

   ```sh
   sudo vim /etc/fstab
   ```

   2. 修改配置

   ```sh
   /dev/mapper/VG00-root   /                       xfs     defaults,noatime        0 0
   ```

   3. 退出配置重新挂载

   ```sh
   sudo mount -o remount /
   ```

3. Nproc Configuration: 

   1. 修改进程数限制

   ```sh
   sudo vim /etc/security/limits.conf
   ```

   2. 修改配置(官网建议调整为 65536 或者 262144)

   ```sh
   *        soft    nproc  655350 
   *        hard    nproc  655350
   *        soft    nofile  655350
   *        hard    nofile  655350
   ```



## 4.设置主机名

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

   运行`uname -a`命令,检查主机名是否与`hostname`命令的输出结果匹配。

   运行`/sbin/ifconfig`命令，注意`eth`输出结果中的`inet addr`的值，例如

   ```sh
   eth0      Link encap:Ethernet  HWaddr 00:0C:29:A4:E8:97  
             inet addr:192.168.7.1  Bcast:172.29.87.255  Mask:255.255.248.0
   ...
   ```

   

## 5.禁用防火墙

1. 保存防火墙规则

   ```sh
   sudo iptables-save > ~/firewall.rules
   ```

2. 禁用防火墙

   ```sh
   sudo systemctl disable firewalld
   sudo systemctl stop firewalld
   ```

## 6.设置SELinux

1. 检查SELinux状态

   ```sh
   getenforce
   ```

   如果输出为`Permissive`或者`Disabled`,可以跳过这一步操作。

2. 编辑`/etc/selinux/config`,使得`SELINUX=enforcing`变成`SELINUX=permissive`，保存退出。

3. 重启系统或者运行下面命令立即禁用SELinux

   ```sh
   sudo setenforce 0
   ```

   

## 7.启用NTP服务

1. ‎CentOS 7默认使用`chronyd`而不是`ntpd`服务用来作为时间同步的工具，所以第一步在**每台机器**上先停止`chronyd`服务。

   ```sh
   sudo systemctl status chronyd
   sudo systemctl stop chronyd
   sudo systemctl disable chronyd
   ```

2. 安装`ntpd`服务

   ```sh
   sudo yum install ntp
   ```

3. 编辑`/etc/ntp.conf`配置文件(此为服务器可以访问外网的配置)

   ```sh
   server 0.cn.pool.ntp.org
   server 1.cn.pool.ntp.org
   server 2.cn.pool.ntp.org
   server 3.cn.pool.ntp.org
   server 4.cn.pool.ntp.org
   server 5.cn.pool.ntp.org
   server 6.cn.pool.ntp.org
   ```

4. 启动`ntpd`服务

   ```sh
   sudo systemctl start ntpd
   ```

5. 配置开启启动

   ```sh
   sudo systemctl enable ntpd
   ```

6. 同步远程服务器时间

   ```sh
   sudo ntpdate -u 0.cn.pool.ntp.org
   ```

7. 同步硬件时钟

   ```sh
   sudo hwclock --systohc
   ```



## 8.禁用tuned服务

1. 确保`tuned`服务开启

   ```sh
   sudo systemctl start tuned
   ```

2. 关闭`tuned`服务

   ```sh
   sudo tuned-adm off
   ```

3. 确保没有使用中配置文件

   ```sh
   sudo tuned-adm list
   ```

   ```sh
   No current active profile
   ```

4. 关闭并禁止自启

   ```sh
   sudo systemctl stop tuned
   sudo systemctl disable tuned
   ```



## 9.关闭透明大页面

1. 编辑`/etc/rc.d/rc.local`文件，新增以下内容

   ```sh
   echo never > /sys/kernel/mm/transparent_hugepage/enabled
   echo never > /sys/kernel/mm/transparent_hugepage/defrag
   ```

   修改`rc.local`文件权限，使其可执行

   ```sh
   sudo chmod +x /etc/rc.d/rc.local
   ```

2. 编辑`GRUB`配置文件`/etc/default/grub`文件中`GRUB_CMDLINE_LINUX`参数，新增以下内容，使得禁用`THP（transparent hugepage）`

   ```sh
   transparent_hugepage=never
   ```

   运行下面命令

   ```sh
   grub2-mkconfig -o /boot/grub2/grub.cfg
   ```



## 10.设置交换空间

1. 查看当前`vm.swappiness`

   ```sh
   cat /proc/sys/vm/swappiness
   ```

2. 设置`vm.swappiness`为`1`

   ```sh
   sudo sysctl -w vm.swappiness=1
   ```