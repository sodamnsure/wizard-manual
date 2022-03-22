## Spark常用transformations算子

### <font color=#FF7F00>map</font>

>map(func):返回一个新的RDD，该RDD由每一个输入元素经过func函数转换后组成。


### <font color=#FF7F00>mapPartitions</font>
>mapPartitions(func):类似于map,但是独立地在RDD的每一个分片上运行，因此在类型为T的RDD上运行时，func的函数类型必须是Iterator[T]=>Iterator[U]。假设有N个元素，有M个分区，那么map的函数将被调用N次，而mapPartitions被调用M次，一个函数一次处理所有分区。

### <font color=#FF7F00>reduceByKey</font>
>reduceBykey(func,[numTask]):在一个(K,V)的RDD上调用，返回一个(K,V)的RDD，使用设置的reduce函数，将相同key的值聚合在一起，reduce任务的个数可以通过第二个可选的参数来设置。

### <font color=#FF7F00>aggregateByKey</font>
> aggregateByKey(zeroValue:U,[partitioner:Partitioner])(seqOp:(U,V) => U, combOp:(U,U) => U):在kv对的RDD中，按key将value进行分组合并，合并时，将每个value和初始值作为seq函数的参数，进行计算，返回的结果作为一个新的kv对，然后再将结果按照key进行合并，最后将每个分组的value传递给combine函数进行计算（先将前两个value进行计算，将返回结果和下一个value传给combine函数，以此类推），将key与计算结果作为一个新的kv对输出。


### <font color=#FF7F00>combineByKey</font>
> combineByKey(createCombiner: V => C, mergeValue(C, V) => C, mergeCombiners:(C, C) => C):
> 对相同K，把V合并成一个集合
>
> 1. createCombiner: combineByKey()会遍历分区中的所有元素，因为每个元素的键要么还没有遇到过，要么就和之前的某个元素的键相同。如果这是一个新的元素，combineByKey()会使用一个叫做 createCombiner()的函数来创建那个键对应的累加器的初始值。
> 2. mergeValue:如果这是一个在处理当前分区之前已经遇到的键，它会使用mergeValue()方法将该键的累加器对应的当前值与这个新的值进行合并。
> mergeCombiners:由于每个分区都是独立处理的，因此对于同一个键可以有多个累加器。如果有两个或者更多的分区都有对应同一个键的累加器，就需要使用用户提供的mergeCombiners()方法将各个分区的结果进行合并。

根据自身情况选择比较熟悉的算子加以介绍。