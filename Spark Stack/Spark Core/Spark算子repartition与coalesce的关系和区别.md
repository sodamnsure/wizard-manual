## Spark算子repartition与coalesce的关系和区别

### <font color=#FF7F00>关系</font>
两者都是用来改变RDD的partition数量，repartition底层调用的就是coalesce方法：coalesce(numPartition, shuffle = true)

### <font color=#FF7F00>区别</font>
repartition一定会发生shuffle，coalesce根据传入的参数来判断是否发生shuffle。
一般情况下增大RDD的partition数量使用repartition，减少partition数量时使用coalesce。