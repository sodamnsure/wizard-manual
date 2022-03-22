## Spark算子reduceByKey与groupByKey的区别

### <font color=#FF7F00>reduceByKey</font>
reduceByKey:按照ket进行聚合，在shuffle之前有combine(预聚合)操作，返回结果是RDD[k,v]。

### <font color=#FF7F00>groupByKey</font>
groupByKey:按照key进行分组，直接进行shuffle。

在不影响业务的前提下，建议使用reduceByKey
