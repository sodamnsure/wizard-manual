# Install and Config

## 一. 所需组件以及版本

1. [官网](https://prometheus.io/)

   [下载地址](https://prometheus.io/download/)

2. 详细组件以及版本：

   [prometheus-2.34.0.linux-amd64.tar.gz](https://github.com/prometheus/prometheus/releases/download/v2.34.0/prometheus-2.34.0.linux-amd64.tar.gz)

   [alertmanager-0.24.0.linux-amd64.tar.gz](https://github.com/prometheus/alertmanager/releases/download/v0.24.0/alertmanager-0.24.0.linux-amd64.tar.gz)

   [node_exporter-1.3.1.linux-amd64.tar.gz](https://github.com/prometheus/node_exporter/releases/download/v1.3.1/node_exporter-1.3.1.linux-amd64.tar.gz)

   [pushgateway-1.4.2.linux-amd64.tar.gz](https://github.com/prometheus/pushgateway/releases/download/v1.4.2/pushgateway-1.4.2.linux-amd64.tar.gz)

   注：报警选择alertmanager，对比grafana的报警机制更加灵活



## 二. 安装Prometheus服务端

1. 下载解压

   ```sh
   tar -zxvf prometheus-2.34.0.linux-amd64.tar.gz -C /opt/software/
   cd /opt/software/
   mv prometheus-2.34.0.linux-amd64/ prometheus
   mkdir -pv prometheus/data
   ```

   

2. 创建用户

   ```sh
   groupadd prometheus
   useradd -g prometheus -M -s /sbin/nologin prometheus
   chown -R prometheus.prometheus /opt/software/prometheus
   ```

   

3. 创建systemd服务

   创建 prometheus 系统服务启动文件 `/usr/lib/systemd/system/prometheus.service`

   ```sh
   [Unit]
   Description=Prometheus Server
   Documentation=https://prometheus.io/docs/introduction/overview/
   After=network-online.target
   
   [Service]
   User=prometheus
   Restart=on-failure
   ExecStart=/opt/software/prometheus/prometheus \
   --config.file=/opt/software/prometheus/prometheus.yml \
   --storage.tsdb.path=/opt/software/prometheus/data
   ExecReload=/bin/kill -HUP $MAINPID
   [Install]
   WantedBy=multi-user.target
   ```



4. 修改prometheus配置文件 `/opt/software/prometheus/prometheus.yml`

   ```yaml
   # my global config
   global:
     scrape_interval: 15s # 全局的采集间隔，默认是 1m，这里设置为 15s
     evaluation_interval: 15s # 全局的规则触发间隔，默认是 1m，这里设置 15s
   
   # Alertmanager configuration
   alerting:
     alertmanagers:
       - static_configs:
           - targets:
             # - alertmanager:9093
   
   # Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
   rule_files:
     # - "first_rules.yml"
     # - "second_rules.yml"
   
   # A scrape configuration containing exactly one endpoint to scrape:
   # Here it's Prometheus itself.
   scrape_configs:
     # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
     - job_name: 'doris_cluster' # 每一个 Doris 集群，我们称为一个 job。这里可以给 job 取一个名字，作为 Doris 集群在监控系统中的名字。
       metrics_path: '/metrics' # 这里指定获取监控项的 restful api。配合下面的 targets 中的 host:port，Prometheus 最终会通过 host:port/metrics_path 来采集监控项。
       static_configs: # 这里开始分别配置 FE 和 BE 的目标地址。所有的 FE 和 BE 都分别写入各自的 group 中。
         - targets: ['node01:8035', 'node02:8035', 'node03:8035']
           labels:
             group: fe # 这里配置了 fe 的 group，该 group 中包含了 3 个 Frontends
   
         - targets: ['node01:8048', 'node02:8048', 'node03:8048']
           labels:
             group: be # 这里配置了 be 的 group，该 group 中包含了 3 个 Backends
     - job_name: 'prometheus'
       static_configs:
        		- targets: ['localhost:9090']
   ```

   

   

5. 启动服务

   ```sh
   systemctl daemon-reload
   systemctl start prometheus.service
   systemctl enable prometheus.service
   systemctl status prometheus.service
   ```

   Prometheus 服务支持热加载配置

   ```sh
   systemctl reload prometheus.service
   ```



## 三. 安装Pushgateway

1. 下载解压

   ```sh
   tar -zxvf pushgateway-1.4.2.linux-amd64.tar.gz -C /opt/software/
   cd /opt/software/
   mv pushgateway-1.4.2.linux-amd64/ pushgateway-1.4.2
   chown -R prometheus.prometheus /opt/software/pushgateway-1.4.2
   ```



2. 创建systemd服务

   创建 pushgateway 系统服务启动文件 `/usr/lib/systemd/system/pushgateway.service`

   ```sh
   [Unit]
   Description=pushgateway
   Documentation=https://prometheus.io/
   After=network.target
   	
   [Service]
   Type=simple
   User=prometheus
   ExecStart=/opt/software/pushgateway-1.4.2/pushgateway
   Restart=on-failure
   
   [Install]
   WantedBy=multi-user.target
   ```


3. 启动服务

   ```sh
   systemctl daemon-reload
   systemctl start pushgateway.service
   systemctl enable pushgateway.service
   systemctl status pushgateway.service
   ```



4. 新增配置`prometheus.yml`

   ```yml
     - job_name: 'pushgateway'
       static_configs:
       	- targets: ['node03:9091']
       		labels:
             instance: pushgateway
   ```

   

## 四. 安装Alertmanager

1. 下载解压

   ```sh
   tar -zxvf alertmanager-0.24.0.linux-amd64.tar.gz -C /opt/software/
   cd /opt/software/
   mv alertmanager-0.24.0.linux-amd64/ alertmanager-0.24.0
   chown -R prometheus.prometheus /opt/software/alertmanager-0.24.0
   ```



2. 修改配置

   ```sh
   route:
     group_by: ['alertname']
     group_wait: 1s
     group_interval: 1m
     repeat_interval: 4h
     receiver: 'webhook1'
   receivers:
   - name: 'webhook1'
     webhook_configs:
       - &dingtalk_config
          send_resolved: true
          url: http://localhost:8060/dingtalk/webhook1/send
   #An inhibition rule mutes an alert (target) matching a set of matchers when an alert (source) exists that matches another set of matchers. Both target and source alerts must have the same label values for the label names in the equal list.
   inhibit_rules:
     - source_match:
         severity: 'critical'
       target_match:
         severity: 'warning'
       equal: ['alertname', 'dev', 'instance']
   ```

3. 创建systemd服务

   创建 pushgateway 系统服务启动文件 `/usr/lib/systemd/system/alertmanager.service`

   ```sh
   [Unit]
   Description=alertmanager
   Documentation=https://prometheus.io/
   After=network.target
   
   [Service]
   Type=simple
   User=root
   ExecStart=/opt/software/alertmanager-0.24.0/alertmanager --config.file=/opt/software/alertmanager-0.24.0/alertmanager.yml --storage.path=/opt/software/alertmanager-0.24.0/data/
   Restart=on-failure
   
   [Install]
   WantedBy=multi-user.target
   ```

4. 启动

   ```sh
   systemctl daemon-reload
   systemctl start alertmanager.service
   systemctl enable alertmanager.service
   systemctl status alertmanager.serviceservice
   ```

   

## 五. 安装Node exporter

1. 下载解压

   ```sh
   tar -zxvf node_exporter-1.3.1.linux-amd64.tar.gz -C /opt/software/
   cd /opt/software/
   mv node_exporter-1.3.1.linux-amd64/ node_exporter-1.3.1
   chown -R prometheus.prometheus /opt/software/node_exporter-1.3.1/
   ```

   

2. 创建systemd服务

   创建 pushgateway 系统服务启动文件 `/usr/lib/systemd/system/node_exporter.service`

   ```sh
   [Unit]
   Description=Node Exporter
   Documentation=https://prometheus.io/
   Wants=network-online.target
   After=network-online.target
   
   [Service]
   Type=simple
   User=prometheus
   ExecStart=/opt/software/node_exporter-1.3.1/node_exporter
   Restart=on-failure
   
   [Install]
   WantedBy=multi-user.target
   ```

   

3. 分发到各个服务器

4. 启动

   ```sh
   systemctl daemon-reload
   systemctl start node_exporter.service
   systemctl enable node_exporter.service
   systemctl status node_exporter.service
   ```

   

5. 新增配置`prometheus.yml`

   ```yaml
     - job_name: 'node_exporter'
       static_configs:
         - targets: ['node01:9100','node02:9100','node03:9100','node04:9100']
   ```
   
   