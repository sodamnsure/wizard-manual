# Prometheus集成Flink

https://www.cnblogs.com/jhno1/p/15688300.html

注：flink-metrics-prometheus-1.12.0.jar这个jar需要部署到flink所能依赖的路径，有的时候不一定在flink/home目录下。

例如在Dinky中需要将jar包提交到`集群配置`选项中`Flink配置`的`lib路径`,一般提交到hdfs上。
