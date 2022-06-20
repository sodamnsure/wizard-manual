# 操作系统要求

## 一、软件依赖

| 组件                   | 版本                          | 查看命令                 |
| ---------------------- | ----------------------------- | ------------------------ |
| Cloudera Manager       | Python 2.7                    | `python -V`              |
| Cloudera Manager       | Perl                          | `perl -version`          |
| Cloudera Manager Agent | iproute-3.10                  | `rpm -qa | grep iproute` |
| Hue                    | Python 2.7                    | `python -V`              |
| Spark2.4               | Python 2.7 and 3.4-3.7        | `python -V`              |
| Spark3.0               | Python 2.7 and 3.4 and higher | `python -V`              |
| Spark3.1               | Python 3.6 and higher         | `python -V`              |



## 二、操作系统

| 操作系统                        | 版本                                              | 查看命令                  |
| ------------------------------- | ------------------------------------------------- | ------------------------- |
| RHEL/CentOS/OL with RHCK kernel | 7.9, 7.8, 7.7, 7.6, 7.5, 7.4, 7.3, 7.2, 6.10, 6.9 | `cat /etc/redhat-release` |



## 三、文件系统

| 类型                | 查看命令 |
| ------------------- | -------- |
| ext3, ext4, XFS, S3 | `df -Th` |



