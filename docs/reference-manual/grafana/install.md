# Installation and Deployment

## 一、所需组件以及版本

1. 参考链接

   [官网](https://grafana.com/)

   [下载地址](https://grafana.com/grafana/download/7.5.9)

2. 详细组件及版本：

   [grafana-enterprise-7.5.9.linux-amd64.tar.gz](https://dl.grafana.com/enterprise/release/grafana-enterprise-7.5.9.linux-amd64.tar.gz)

## 二、安装Grafana与配置

1. 下载并安装

   ```sh
   wget https://dl.grafana.com/enterprise/release/grafana-enterprise-7.5.9-1.x86_64.rpm
   sudo yum install grafana-enterprise-7.5.9-1.x86_64.rpm
   ```



2. 启动grafana

   设置grafana服务开机自启，并启动服务

   ```sh
   systemctl daemon-reload
   systemctl enable grafana-server.service
   systemctl start grafana-server.service
   ```



3. 访问grafana

   [http://192.168.3.**:3000](https://link.zhihu.com/?target=https%3A//www.oschina.net/action/GoToLink%3Furl%3Dhttp%3A%2F%2F192.168.56.200%3A3000)
