# Installing Cloudera Manager and CDH

## 1.配置本地Repository

1. 配置Local Parcel Repository

   1. 安装`Apache HTTP`服务

      ```sh
      sudo yum install httpd
      ```

   2. 编辑`/etc/httpd/conf/httpd.conf`文件，在`<IfModule mime_module>`模块添加文件支持

      ```sh{10}
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

   4. 从百度云下载离线包到服务器`/opt/package/cdh6.3.2`目录(下载目录可以自己随意指定)。

      ```sh
      
      ```

      

   5. 配置Parcel到Repository

      ```sh
      sudo mkdir -p /var/www/html/cloudera-repos
      sudo mkdir -p /var/www/html/cloudera-repos/cdh6
      sudo cp /opt/package/cdh6.3.2/
      sudo chmod -R ugo+rX /var/www/html/cloudera-repos/cdh6
      ```

   6. 在页面安装页面，选择`Remote Parcel Repository URLs`输入仓库地址:`http://<web_server>/cloudera-parcels/cdh6/6.3.3/`

