## <center><font color=#5C4033>HDFS读写流程</font></center>

### <font color=#FF7F00>读流程</font>
#### <font color=#FAA400>步骤</font>
1. 客户端调用`DistributedFileSystem`的`open()`方法打开文件。
2. `DistributedFileSystem`通过`RPC`连接到`NameNode`,请求获取文件的数据块信息；`NameNode`返回给文件的部分或者全部的数据块列表；对于每一个数据块，`NameNode`返回存储该数据块副本的`DataNode`地址；`DistributedFileSystem`返回给客户端`FSDataInputStream`来读取数据。
3. 客户端调用`FSDataInputStream`的`read()`方法开始读取数据。
4. `FSDataInputStream`连接保存此文件的第一个数据块的最近`DataNode`,并以数据流的形式读取数据；客户端多次调用`read()`，直到到达数据块结束位置。
5. `FSDataInputStream`连接保存此文件下一个数据块的最近`DataNode`，并读取数据。
6. 当客户端读取完文件的所有数据块的数据后，调用`FSDataInputStream`的`close()`方法关闭数据。

注：在读取数据的过程中，如果客户端在与数据节点通信时出现错误，则尝试连接包含此数据块的下一个数据节点。失败的数据节点将被记录，并且以后不再连接。


### <font color=#FF7F00>写流程</font>
#### <font color=#FAA400>步骤</font>
1. 客户端调用`DistributedFileSystem`的`create()`方法来创建一个新文件。
2. `DistributedFileSystem`通过`RPC`向`NameNode`申请写入新文件。
3. `NameNode`检查要创建的文件是否存在，创建者是否有权限进行操作，成功则会创建一个记录，否则会让客户端抛出异常。
4. `DistributedFileSystem`返回给客户端一个输出流对象`FSDataOutputStream`,供客户端进行写操作。`FSDataOutputStream`对象中封装了一个`DFSOutputStream`对象，管理着`NameNode`与`DataNode`之间的通信。
5. 客户端调用`FSDataOutputStream`对象的`write()`方法开始写入数据，`DFSOutputStream`对象将文件切分成多个`packet`，并在内部以数据队列`data queue`形式管理这些`packet`，然后向`NameNode`申请`blocks`,获取用来存储``