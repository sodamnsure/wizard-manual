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



## 三、参考链接

1. 官网链接：

   [Download and Install ProxySQL](https://proxysql.com/documentation/installing-proxysql/)
