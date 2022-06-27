# Installing Cloudera Manager and CDH

## 1.配置本地Repository

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

   4. 从[百度云](https://pan.baidu.com/s/1dpyhF6TRXaqryab6ZVVXfw)(提取码:`1cuo`)下载离线包并解压到服务器`/opt/package/cdh6.3.2`目录(下载目录可以自己随意指定)，目录结构如下：

      ```sh
      cd /opt/package/cdh6.3.2
      tar -zxvf cm6.3.1-redhat7.tar.gz
      tree -C -L 5
      ```
      
      ```sh
      .
      ├── CDH-6.3.2-1.cdh6.3.2.p0.1605554-el7.parcel
      ├── CDH-6.3.2-1.cdh6.3.2.p0.1605554-el7.parcel.sha1
      ├── CDH-6.3.2-1.cdh6.3.2.p0.1605554-el7.parcel.sha256
      ├── RPM-GPG-KEY-cloudera
      ├── cloudera-manager.repo
      ├── cm6.3.1
      │   ├── RPM-GPG-KEY-cloudera
      │   ├── RPMS
      │   │   ├── noarch
      │   │   └── x86_64
      │   │       ├── cloudera-manager-agent-6.3.1-1466458.el7.x86_64.rpm
      │   │       ├── cloudera-manager-daemons-6.3.1-1466458.el7.x86_64.rpm
      │   │       ├── cloudera-manager-server-6.3.1-1466458.el7.x86_64.rpm
      │   │       ├── cloudera-manager-server-db-2-6.3.1-1466458.el7.x86_64.rpm
      │   │       ├── enterprise-debuginfo-6.3.1-1466458.el7.x86_64.rpm
      │   │       └── oracle-j2sdk1.8-1.8.0+update181-1.x86_64.rpm
      │   ├── SRPMS
      │   └── repodata
      │       ├── 3662f97de72fd44c017bb0e25cee3bc9398108c8efb745def12130a69df2ecb2-filelists.sqlite.bz2
      │       ├── 43f3725f730ee7522712039982aa4befadae4db968c8d780c8eb15ae9872cd4d-primary.xml.gz
      │       ├── 49e4d60647407a36819f1d8ed901258a13361749b742e3be9065025ad31feb8e-filelists.xml.gz
      │       ├── 8afda99b921fd1538dd06355952719652654fc06b6cd14515437bda28376c03d-other.sqlite.bz2
      │       ├── b9300879675bdbc300436c1131a910a535b8b5a5dc6f38e956d51769b6771a96-primary.sqlite.bz2
      │       ├── e28836e19e07f71480c4dad0f7a87a804dc93970ec5277ad95614e8ffcff0d58-other.xml.gz
      │       ├── repomd.xml
      │       ├── repomd.xml.asc
      │       └── repomd.xml.key
      ├── cm6.3.1-redhat7.tar.gz
      └── manifest.json
      ```
      
      

   5. 配置Parcel到Repository

      ```sh
      sudo mkdir -p /var/www/html/cloudera-repos
      sudo mkdir -p /var/www/html/cloudera-repos/cdh6
      sudo cp CDH-6.3.2-1.cdh6.3.2.p0.1605554-el7.parcel* /var/www/html/cloudera-repos/cdh6
      sudo cp manifest.json /var/www/html/cloudera-repos/cdh6
      sudo chmod -R ugo+rX /var/www/html/cloudera-repos/cdh6
      ```

   6. 在页面安装页面，选择`Remote Parcel Repository URLs`输入仓库地址:`http://<web_server>/cloudera-parcels/cdh6/6.3.3/`

