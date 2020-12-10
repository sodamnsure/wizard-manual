#### 查看 CPU 物理个数
`grep 'physical id' /proc/cpuinfo | sort -u | wc -l`
#### 查看 CPU 核心数量
`grep 'core id' /proc/cpuinfo | sort -u | wc -l`
#### 查看 CPU 线程数
`grep 'processor' /proc/cpuinfo | sort -u | wc -l`
#### 查看 CPU 型号
`dmidecode -s processor-version`
#### 查看 CPU 的详细信息
`cat /proc/cpuinfo`