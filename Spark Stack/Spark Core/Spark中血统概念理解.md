## <center><font color=#5C4033>Spark血统概念理解</font></center>

### <font color=#FF7F00>Lineage简介</font>
RDD Lineage被称为RDD运算图或RDD依赖关系图，是RDD的逻辑执行计划，当某个RDD的部分分区数据丢失时，可以通过Lineager找到丢失的父RDD的分区进行局部计算来恢复丢失的数据，节省资源提高运行效率。

### <font color=#FF7F00>Lineage依赖的类型</font>
RDD在Lineage依赖方面分为两种 `Narrow Dependencies` 与 `Wide Dependencies`，解决数据容错时的高效性以及划分任务时候起到重要作用。


### <font color=#FF7F00>参考链接</font>
[Spark Lineage(血统)](https://blog.csdn.net/u013063153/article/details/73865123)
