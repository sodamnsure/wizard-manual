## <center><font color=#5C4033>Spark中的共享变量</font></center>
默认情况下，如果一个算子的函数使用到了某个外部的变量，那么这个变量的值会被拷贝到每个task中。此时每个task只能操作自己的那份变量副本，
如果多个task想要共享某个变量，是做不到的。

Spark为此提供两种共享变量，一种是Broadcast Variable(广播变量)，另一种是Accumulator(累加变量)。Broadcast Variable会将使用到的变量，仅仅为每个节点拷贝一份，
如果使用外部变量，每个task会拷贝一份，更大的用处是优化性能。Accumulator则是让多个task共同操作一份变量，主要可以进行累加操作。

### <font color=#FF7F00>Broadcast Variable</font>
Spark提供的Broadcast Variable，是只读的。并且在每个节点上只会有一份副本，而不会为每个task都拷贝一份副本。因此其最大作用，就是减少变量到各个节点的网络传输消耗，以及在各个节点上的内存消耗。此外，spark自己内部也使用了高效的广播算法来减少网络消耗。
可以通过调用SparkContext的broadcast()方法，来针对某个变量创建广播变量。然后在算子的函数内，使用到广播变量时，每个节点只会拷贝一份副本了。每个节点可以使用广播变量的value()方法获取值。记住，广播变量，**是只读的**。
```scala
val factor = 3

val factorBroadcast = sc.broadcast(factor)

val arr = Array(1, 2, 3, 4, 5)

val rdd = sc.parallelize(arr)

val multipleRdd = rdd.map(num => num * factorBroadcast.value())

multipleRdd.foreach(num => println(num))
```

### <font color=#FF7F00>Accumulator</font>
Spark提供的Accumulator，主要用于多个节点对一个变量进行共享性的操作。Accumulator只提供了累加的功能。但是确给我们提供了多个task对一个变量并行操作的功能。但是**task只能对Accumulator进行累加操作**，不能读取它的值。只有Driver程序可以读取Accumulator的值。

```scala
val sumAccumulator = sc.accumulator(0)

val arr = Array(1, 2, 3, 4, 5)

val rdd = sc.parallelize(arr)

rdd.foreach(num => sumAccumulator += num)

println(sumAccumulator.value)
```

### <font color=#FF7F00>参考链接</font>
[Spark中共享变量](https://blog.csdn.net/lp284558195/article/details/81456652)

