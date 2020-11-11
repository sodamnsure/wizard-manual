## <center><font color=#5C4033>Spark宽窄依赖</font></center>

### <font color=#FF7F00>窄依赖</font>
`Narrow Dependencies`是指父RDD的每一个分区最多被一个子RDD分区所用，表现为一个父RDD的分区对应于一个子RDD的分区或者多个父RDD的分区对应一个子RDD的分区，也就是说一个父RDD的分区不可能对应一个子RDD的多个分区。


### <font color=#FF7F00>宽依赖</font>
`Wide Dependencies`是指子RDD的分区依赖于父RDD的多个分区或者所有分区，也就是说存在一个父RDD的一个分区对一个子RDD的多个分区。`这种计算的输入和输出在不同的节点上，lineage方法对与输入节点完好，而输出节点宕机时，通过重新计算，这种情况下，这种方法容错是有效的，否则无效，因为无法重试，需要向上其祖先追溯看是否可以重试（这就是lineage，血统的意思）Narrow Dependencies对于数据的重算开销要远小于Wide Dependencies的数据重算开销。`


![宽窄依赖](img/宽窄依赖.png)