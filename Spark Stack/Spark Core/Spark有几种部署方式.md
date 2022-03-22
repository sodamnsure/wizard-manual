## Spark部署方式以及区别

### <font color=#FF7F00>Local模式</font>
运行在一台机器上，常用于本地测试开发，可以通过设置master参数值设置计算的线程数目。
1. local：在本地启动一个`worker`线程。
2. local[n]：在本地启动n个`worker`线程。
3. local[*]：在本地按照CPU的最多核数来启动`worker`线程。


### <font color=#FF7F00>Standalone模式</font>
构建一个基于`Master+Slaves`的资源调度集群，Spark任务提交给`Master`运行。设置`master`参数的值为`spark://host:port`，即开启Standalone模式


### <font color=#FF7F00>Yarn模式</font>
Spark客户端直接连接`Yarn`,不需要额外构建Spark集群，有`yarn-client`和`yarn-cluster`两种模式，主要区别在于`Driver`程序运行节点不同。`master`参数设置为`yarn`,`deploy-mode`参数为`client`或者`cluster`。
1. `yarn-client`的`Driver`程序运行在客户端，适用于交互、调试。
2. `yarn-cluster`的`Driver`程序运行在由进程`ResourceManager`启动的`ApplicationMaster`中，适用于生产环境。

### <font color=#FF7F00>Mesos模式</font>
Spark客户端直接连接`Mesos`，不需要额外构建Spark集群。
在Spark的后续版本中，已经支持连接到`Kubernetes`集群。


**这四种模式的差别在于资源管理者是谁。**


---

参考链接
* [官网介绍](http://spark.apache.org/docs/latest/submitting-applications.html#master-urls)
* [CSDN参考链接](https://blog.csdn.net/qq_33054265/article/details/87563602)
* [简书参考链接](https://www.jianshu.com/p/58d1c9bbfbb1)


重点是前三种部署模式，特别是各个部署模式的`Master`参数如何设置，以及各自含义。