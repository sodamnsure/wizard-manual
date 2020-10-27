<center><font color=#5C4033 size=30>CREATE Database OR TABLE</font></center>

### <font color=#FF7F00>创建数据库</font>

#### <font color=#FAA400>查看创建数据库语句</font>

语法：
```sql
SHOW CREATE {DATABASE | SCHEMA} [IF NOT EXISTS] db_name
```
案例：
```sql
show create database world;
```
输出：
```sql
MySQL> show create database world;
+----------+------------------------------------------------------------------+
| Database | Create Database                                                  |
+----------+------------------------------------------------------------------+
| world    | CREATE DATABASE `world` /*!40100 DEFAULT CHARACTER SET latin1 */ | 
+----------+------------------------------------------------------------------+
1 row in set (0.00 sec)
```

#### <font color=#FAA400>创建数据库</font>
语法：
```sql
CREATE DATABASE IF NOT EXISTS RUNOOB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;
```

### <font color=#FF7F00>查看数据库占用存储</font>
案例：
```sql
MySQL> SELECT table_schema "Database", 
SUM(data_length + index_length)/1024/1024 "Size in MB" 
FROM information_schema.TABLES GROUP BY table_schema;
+--------------------+-------------+
| Database           | Size in MB  |
+--------------------+-------------+
| bupf               | 20.09464169 |
| hr                 |  0.28685379 |
| information_schema |  0.00976563 |
| mucemppf           |  4.50534534 |
| MySQL              |  2.43705654 |
| performance_schema |  0.00000000 |
| sakila             |  6.57598877 |
| sample             |  0.73437500 |
| test               |  0.06250000 |
| tutorial           |  0.02406311 |
| world              |  0.43582153 |
+--------------------+-------------+
11 rows in set (0.17 sec)
```


### <font color=#FF7F00>创建表</font>

#### <font color=#FAA400>查看建表语句</font>

案例：
```sql
show create table campaign_cost_report;
```

#### <font color=#FAA400>创建表</font>
语法：
```sql
CREATE TABLE `campaign_cost_report` (
  `ymd` varchar(10) NOT NULL,
  `website` varchar(20) NOT NULL,
  `Campaign` varchar(100) NOT NULL,
  `ExternalCampaignId` varchar(20) NOT NULL DEFAULT '',
  `Device` varchar(15) NOT NULL DEFAULT '',
  `Country` varchar(50) DEFAULT '',
  `Impressions` int(10) DEFAULT NULL,
  `Clicks` int(10) DEFAULT NULL,
  `ConversionsManyPerClick` int(10) DEFAULT NULL,
  `ClickThroughRate` float(10,2) DEFAULT NULL,
  `CostPerClick` float(10,2) DEFAULT NULL,
  `CostPerConversionManyPerClick` float(10,2) DEFAULT NULL,
  `ConversionRateManyPerClick` float(10,2) DEFAULT NULL,
  `Cost` float(10,2) DEFAULT NULL,
  `create_time` int(10) DEFAULT NULL,
  `update_time` int(10) DEFAULT NULL,
  PRIMARY KEY (`ymd`,`website`,`Campaign`,`ExternalCampaignId`,`Device`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
```

