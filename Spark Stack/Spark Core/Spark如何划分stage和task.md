## Spark如何划分stage和task

### <font color=#FF7F00>Stage</font>

Stage:根据RDD之间依赖关系的不同将job划分成不同的Stage，遇到一个宽依赖则划分一个Stage。

### <font color=#FF7F00>Task</font>

Task：Stage是一个TaskSet，将Stage根据分区数划分成一个个的Task。