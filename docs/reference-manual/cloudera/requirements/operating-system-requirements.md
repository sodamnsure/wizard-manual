# 操作系统要求

## 一、软件依赖

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

## 二、操作系统

1. CDH6.3.x 对Centos操作系统版本要求：7.9, 7.8, 7.7, 7.6, 7.5, 7.4, 7.3, 7.2, 6.10, 6.9

   ```sh
   cat /etc/redhat-release
   ```

2. CDH6.2.x 对Centos操作系统版本要求：7.9, 7.8, 7.7, 7.6, 7.5, 7.4, 7.3, 7.2, 6.10, 6.9, 6.8

   ```sh
   cat /etc/redhat-release
   ```

## 三、文件系统

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
   mount -o remount /
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