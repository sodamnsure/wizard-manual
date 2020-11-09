## <center><font color=#5C4033>Spark提交作业参数</font></center>

### <font color=#FF7F00>常用参数归纳如下</font>
```
--driver-memory: driver内存大小

--executor-memory: 每个executor的内存

--num-executors: 总共申请的executor的数目

--executor-cores: 每个executor内的核数，即每个executor中可并行的任务task数

--spark.default.parallelism: join、reduceByKey、parallelize等转换返回RDD中的默认分区数

--spark.sql.shuffle.partitions：sparks SQL join、聚合等进行数据shuffling会使用的分区数

--spark.dynamicAllocation.enabled: 设置是否开启动态资源配置

--spark.executor.memoryOverhead： 分配给每个executor的堆外内存量
```


---

参考链接
* [官网链接](http://spark.apache.org/docs/latest/submitting-applications.html#launching-applications-with-spark-submit)
* [EMR 上的 Spark 作业优化实践](https://aws.amazon.com/cn/blogs/china/spark-job-ptimization-practice-on-emr/)

