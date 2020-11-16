## <center><font color=#5C4033>Spark常用shuffle算子</font></center>

### [三大分类](http://spark.apache.org/docs/latest/rdd-programming-guide.html#shuffle-operations)
1. Repartition operations like `repartition` and `coalesce`。
2. ByKey operations (except for counting) like `groupByKey` and `reduceByKey`。
3. Join operations like `cogroup` and `join`。

### <font color=#FF7F00>Repartition Operations</font>
注：
1. 减少分区时，一般无需shuffle，二者皆可。
2. 增加分区时，需要shuffle，一般用repartition,因为方便。

#### coalesce算子
`coalesce`实现
```scala
def coalesce(numPartitions: Int, shuffle: Boolean = false,
               partitionCoalescer: Option[PartitionCoalescer] = Option.empty)
              (implicit ord: Ordering[T] = null)
      : RDD[T] = withScope {
    require(numPartitions > 0, s"Number of partitions ($numPartitions) must be positive.")
    if (shuffle) {
      /** Distributes elements evenly across output partitions, starting from a random partition. */
      val distributePartition = (index: Int, items: Iterator[T]) => {
        var position = new Random(hashing.byteswap32(index)).nextInt(numPartitions)
        items.map { t =>
          // Note that the hash code of the key will just be the key itself. The HashPartitioner
          // will mod it with the number of total partitions.
          position = position + 1
          (position, t)
        }
      } : Iterator[(Int, T)]

      // include a shuffle step so that our upstream tasks are still distributed
      new CoalescedRDD(
        new ShuffledRDD[Int, T, T](
          mapPartitionsWithIndexInternal(distributePartition, isOrderSensitive = true),
          new HashPartitioner(numPartitions)),
        numPartitions,
        partitionCoalescer).values
    } else {
      new CoalescedRDD(this, numPartitions, partitionCoalescer)
    }
  }
```
从源码中可以看到无论是否经过shuffle最终返回的都是`CoalescedRDD`，其中区别是经过shuffle需要为每个元素分配key,并根据key将所有的元素平均分配到task中。

#### repartition算子
该函数其实就是coalesce函数第二个参数为true的实现。
```scala
def repartition(numPartitions: Int)(implicit ord: Ordering[T] = null): RDD[T] = withScope {
    coalesce(numPartitions, shuffle = true)
}
```


#### 注意
他们两个都是RDD的分区进行重新划分，repartition只是coalesce接口中shuffle为true的简易实现，（假设RDD有N个分区，需要重新划分成M个分区）
1. N < M。一般情况下N个分区有数据分布不均匀的状况，利用HashPartitioner函数将数据重新分区为M个，这时需要将shuffle设置为true。
2. 如果N > M并且N和M相差不多，(假如N是1000，M是100)那么就可以将N个分区中的若干个分区合并成一个新的分区，最终合并为M个分区，这时可以将shuff设置为false，在shuffl为false的情况下，如果M>N时，coalesce为无效的，不进行shuffle过程，父RDD和子RDD之间是窄依赖关系。
3. 如果N > M并且两者相差悬殊，这时如果将shuffle设置为false，父子RDD是窄依赖关系，他们同处在一个stage中，就可能造成Spark程序的并行度不够，从而影响性能，如果在M为1的时候，为了使coalesce之前的操作有更好的并行度，可以讲shuffle设置为true。



### <font color=#FF7F00>ByKey Operations</font>

#### groupByKey算子


#### reduceByKey算子

