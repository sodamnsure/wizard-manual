## Spark提交作业流程

### <font color=#FF7F00>YarnClient</font>
```
1. 创建sparkContext对象时，客户端先在本地启动driver，然后客户端向ResourceManager节点申请启动应用程序的ApplicationMaster。
2. ResourceManager收到请求，找到满足资源条件要求的NodeManager启动第一个Container，然后要求该NodeManager在该Container内启动ApplicationMaster.
3. ApplicationMaster启动成功则向ResourceManager申请资源，ResourceManager收到请求给ApplicationMaster返回一批满足资源条件的NodeManager列表。
4. ApplicationMaster拿到NodeManager列表则到这些节点启动container，并在container内启动executor,executor启动成功后则会向driver注册自己。
5. ececutor注册成功，则driver发送task到executor,一个executor可以运行一个或者多个task。
6. executor接收到task，首先DAGScheduler按RDD的宽窄依赖关系切割job划分stage,然后将stage以TaskSet的方式提交给TaskScheduler.
7. TaskScheduler遍历TaskSet将一个个task发送到executor的线程池执行。
8. driver会监控所有task执行的整个流程，并将执行完的结果回收。
```



### <font color=#FF7F00>YarnCluster</font>
```
1. 创建sparkContext对象时，客户端向ResourceManager节点申请启动应用程序的ApplicationMaster.
2. ResourceManager收到请求，找到满足资源条件要求的NodeManager启动第一个Container,然后要求该NodeManager在Container内启动ApplicationMaster.
3. ApplicationMaster启动成功则向ResourceManager申请资源，ResourceManager收到请求给ApplicationMaster返回一批满足资源条件的NodeManager列表。
4. ApplicationMaster拿到NodeManager列表则到这些节点启动container，并在container内启动executor,executor启动成功则会向driver注册自己。
5. executor注册成功，则driver发送task到executor,一个executor可以运行一个或者多个task.
6. executor接收到task，首先DAGScheduler按RDD的宽窄依赖关系切分job划分stage,然后将stage以TaskSet的方式提交给TaskScheduler.
7. TaskScheduler遍历TaskSet将一个个task发送到executor的线程池中执行。
8. driver会监控所有task执行的整个流程，并将执行完的结果回收。
```

cluster模式下driver分散运行在集群节点，有效避免了client的问题。生产用的就是cluster模式。


### <font color=#FF7F00>参考链接</font>
[细致分析Spark on Yarn 模式](https://blog.csdn.net/pengzonglu7292/article/details/79517051)

[Spark任务提交方式和执行流程](https://www.cnblogs.com/frankdeng/p/9301485.html)

