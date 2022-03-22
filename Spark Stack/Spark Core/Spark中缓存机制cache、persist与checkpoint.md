## Spark中缓存机制cache、persist与checkpoint

### <font color=#FF7F00>关系</font>
都是做RDD持久化的

cache:内存，不会截断血缘关系，使用计算过程中的数据缓存。
checkpoint:磁盘，截断血缘关系，在ck之前必须没有任何任务提交才会生效，ck过程会额外提交一次任务。