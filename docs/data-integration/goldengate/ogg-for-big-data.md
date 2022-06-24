# Oracle GoldenGate for Big Data

[Oracle GoldenGate for Big Data](https://docs.oracle.com/en/middleware/goldengate/big-data/index.html)是Oracle官方的将数据库数据实时流式传输到大数据系统的工具。

## 一、环境要求

* 目标端版本和源端Oracle GoldenGate保持一致，或者高于源端OGG版本，推荐使用最新版本。
* [目标端官网下载地址](https://edelivery.oracle.com/osdc/faces/SoftwareDelivery)，搜索`Oracle GoldenGate for Big Data`下载对应版本(本文使用的是**12.3.2.1.0**版本)即可。
* Oracle GoldenGate for Big Data运行需要依赖Java环境，且JDK版本大于等于1.8。

## 二、安装步骤

1. 解压到对应目录，安装包下载到`/opt/package/ogg`目录

   ```sh
   cd /opt/package/ogg
   unzip V979723-01.zip
   mkdir -p /opt/software/ogg
   tar -xvf OGG_BigData_Linux_x64_12.3.2.1.1.tar -C /opt/software/ogg/
   ```

2. 编辑环境变量

   ```sh
   sudo vim /etc/profile
   ```

   ```sh
   export OGG_HOME=/opt/software/ogg/
   export PATH=$OGG_HOME:$PATH 
   export LD_LIBRARY_PATH=$JAVA_HOME/jre/lib/amd64/server:$LD_LIBRARY_PATH 
   ```

   ```sh
   source /etc/profile
   ```

3. 初始化目录

   ```sh
   ggsci
   ```

   ```sh
   create subdirs
   ```

   结果

   ```sh
   GGSCI (monalisa.wizard.com) 1> create subdirs
   
   Creating subdirectories under current directory /opt/software/ogg
   
   Parameter file                 /opt/software/ogg/dirprm: created.
   Report file                    /opt/software/ogg/dirrpt: created.
   Checkpoint file                /opt/software/ogg/dirchk: created.
   Process status files           /opt/software/ogg/dirpcs: created.
   SQL script files               /opt/software/ogg/dirsql: created.
   Database definitions files     /opt/software/ogg/dirdef: created.
   Extract data files             /opt/software/ogg/dirdat: created.
   Temporary files                /opt/software/ogg/dirtmp: created.
   Credential store files         /opt/software/ogg/dircrd: created.
   Masterkey wallet files         /opt/software/ogg/dirwlt: created.
   Dump files                     /opt/software/ogg/dirdmp: created.
   ```

4. 开启配置管理器`mgr`

   ```sh
   GGSCI (monalisa.wizard.com) 1>  edit param mgr
   PORT 7809
   DYNAMICPORTLIST 7810-7909
   AUTORESTART EXTRACT *,RETRIES 5,WAITMINUTES 3
   PURGEOLDEXTRACTS ./dirdat/*,usecheckpoints, minkeepdays 1
   ```

   编辑完成后用vim的退出命令即可退出，启动`mgr`。

   ```sh
   GGSCI (monalisa.wizard.com) 4> start mgr
   Manager started.
   ```

   然后运行`info all`查看`MANAGER`的Status是否`RUNNING`即可。