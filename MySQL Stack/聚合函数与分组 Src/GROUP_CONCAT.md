<center><font color=#5C4033 size=30>GROUP_CONCAT()</font></center>
[toc]

### <font color=#FF7F00>解释</font>
分组列合并：分组后将某列的值合并成一行。
注：连接所有非 NULL 的字符串。如果没有非 NULL 的字符串，那么它就会返回 NULL。

### <font color=#FF7F00>语法</font>
```sql
group_concat([DISTINCT] 要连接的字段 [Order BY ASC/DESC 排序字段] [Separator '分隔符']) 
```

### <font color=#FF7F00>案例</font>
#### <font color=#FFE384>处理1：合并字段到一行</font>
表`book_mast`结构：
<pre>
+---------+-------------------------------------+-------------+---------+--------+--------+------------+----------+---------+------------+
| book_id | book_name                           | isbn_no     | cate_id | aut_id | pub_id | dt_of_pub  | pub_lang | no_page | book_price |
+---------+-------------------------------------+-------------+---------+--------+--------+------------+----------+---------+------------+
| BK001   | Introduction to Electrodynamics     | 0000979001  | CA001   | AUT001 | P003   | 2001-05-08 | English  |     201 |      85.00 |
| BK002   | Understanding of Steel Construction | 0000979002  | CA002   | AUT002 | P001   | 2003-07-15 | English  |     300 |     105.50 |
| BK003   | Guide to Networking                 | 0000979003  | CA003   | AUT003 | P002   | 2002-09-10 | Hindi    |     510 |     200.00 |
| BK004   | Transfer  of Heat and Mass          | 0000979004  | CA002   | AUT004 | P004   | 2004-02-16 | English  |     600 |     250.00 |
| BK005   | Conceptual Physics                  | 0000979005  | CA001   | AUT005 | P006   | 2003-07-16 | NULL     |     345 |     145.00 |
| BK006   | Fundamentals of Heat                | 0000979006  | CA001   | AUT006 | P005   | 2003-08-10 | German   |     247 |     112.00 |
| BK007   | Advanced 3d Graphics                | 0000979007  | CA003   | AUT007 | P002   | 2004-02-16 | Hindi    |     165 |      56.00 |
| BK008   | Human Anatomy                       | 0000979008  | CA005   | AUT008 | P006   | 2001-05-17 | German   |      88 |      50.50 |
| BK009   | Mental Health Nursing               | 0000979009  | CA005   | AUT009 | P007   | 2004-02-10 | English  |     350 |     145.00 |
| BK010   | Fundamentals of Thermodynamics      | 0000979010  | CA002   | AUT010 | P007   | 2002-10-14 | English  |     400 |     225.00 |
| BK011   | The Experimental Analysis of Cat    | 0000979011  | CA004   | AUT011 | P005   | 2007-06-09 | French   |     225 |      95.00 |
| BK012   | The Nature  of World                | 0000979012  | CA004   | AUT005 | P008   | 2005-12-20 | English  |     350 |      88.00 |
| BK013   | Environment a Sustainable Future    | 0000979013  | CA004   | AUT012 | P001   | 2003-10-27 | German   |     165 |     100.00 |
| BK014   | Concepts in Health                  | 0000979014  | CA005   | AUT013 | P004   | 2001-08-25 | NULL     |     320 |     180.00 |
| BK015   | Anatomy & Physiology                | 0000979015  | CA005   | AUT014 | P008   | 2000-10-10 | Hindi    |     225 |     135.00 |
| BK016   | Networks and Telecommunications     | 00009790_16 | CA003   | AUT015 | P003   | 2002-01-01 | French   |      95 |      45.00 |
+---------+-------------------------------------+-------------+---------+--------+--------+------------+----------+---------+------------+
</pre>

代码：
```sql
SELECT pub_id,GROUP_CONCAT(cate_id)
FROM book_mast
GROUP BY pub_id;
```

输出：
```sql
mysql> SELECT pub_id,GROUP_CONCAT(CATE_ID)
    -> FROM book_mast
    -> GROUP BY pub_id;
+--------+-----------------------+
| pub_id | GROUP_CONCAT(CATE_ID) |
+--------+-----------------------+
| P001   | CA002,CA004           | 
| P002   | CA003,CA003           | 
| P003   | CA001,CA003           | 
| P004   | CA005,CA002           | 
| P005   | CA001,CA004           | 
| P006   | CA005,CA001           | 
| P007   | CA005,CA002           | 
| P008   | CA005,CA004           | 
+--------+-----------------------+
8 rows in set (0.02 sec)
```

#### <font color=#FFE384>处理2：合并字段不同(distinct)的值到一行</font>
表`book_mast`结构：
<pre>
+---------+-------------------------------------+-------------+---------+--------+--------+------------+----------+---------+------------+
| book_id | book_name                           | isbn_no     | cate_id | aut_id | pub_id | dt_of_pub  | pub_lang | no_page | book_price |
+---------+-------------------------------------+-------------+---------+--------+--------+------------+----------+---------+------------+
| BK001   | Introduction to Electrodynamics     | 0000979001  | CA001   | AUT001 | P003   | 2001-05-08 | English  |     201 |      85.00 |
| BK002   | Understanding of Steel Construction | 0000979002  | CA002   | AUT002 | P001   | 2003-07-15 | English  |     300 |     105.50 |
| BK003   | Guide to Networking                 | 0000979003  | CA003   | AUT003 | P002   | 2002-09-10 | Hindi    |     510 |     200.00 |
| BK004   | Transfer  of Heat and Mass          | 0000979004  | CA002   | AUT004 | P004   | 2004-02-16 | English  |     600 |     250.00 |
| BK005   | Conceptual Physics                  | 0000979005  | CA001   | AUT005 | P006   | 2003-07-16 | NULL     |     345 |     145.00 |
| BK006   | Fundamentals of Heat                | 0000979006  | CA001   | AUT006 | P005   | 2003-08-10 | German   |     247 |     112.00 |
| BK007   | Advanced 3d Graphics                | 0000979007  | CA003   | AUT007 | P002   | 2004-02-16 | Hindi    |     165 |      56.00 |
| BK008   | Human Anatomy                       | 0000979008  | CA005   | AUT008 | P006   | 2001-05-17 | German   |      88 |      50.50 |
| BK009   | Mental Health Nursing               | 0000979009  | CA005   | AUT009 | P007   | 2004-02-10 | English  |     350 |     145.00 |
| BK010   | Fundamentals of Thermodynamics      | 0000979010  | CA002   | AUT010 | P007   | 2002-10-14 | English  |     400 |     225.00 |
| BK011   | The Experimental Analysis of Cat    | 0000979011  | CA004   | AUT011 | P005   | 2007-06-09 | French   |     225 |      95.00 |
| BK012   | The Nature  of World                | 0000979012  | CA004   | AUT005 | P008   | 2005-12-20 | English  |     350 |      88.00 |
| BK013   | Environment a Sustainable Future    | 0000979013  | CA004   | AUT012 | P001   | 2003-10-27 | German   |     165 |     100.00 |
| BK014   | Concepts in Health                  | 0000979014  | CA005   | AUT013 | P004   | 2001-08-25 | NULL     |     320 |     180.00 |
| BK015   | Anatomy & Physiology                | 0000979015  | CA005   | AUT014 | P008   | 2000-10-10 | Hindi    |     225 |     135.00 |
| BK016   | Networks and Telecommunications     | 00009790_16 | CA003   | AUT015 | P003   | 2002-01-01 | French   |      95 |      45.00 |
+---------+-------------------------------------+-------------+---------+--------+--------+------------+----------+---------+------------+
</pre>

代码：
```sql
SELECT pub_id,GROUP_CONCAT(DISTINCT cate_id)
FROM book_mast
GROUP BY pub_id; 
```

输出：
```sql
mysql> SELECT pub_id,GROUP_CONCAT(DISTINCT cate_id)
    -> FROM book_mast
    -> GROUP BY pub_id;
+--------+--------------------------------+
| pub_id | GROUP_CONCAT(DISTINCT cate_id) |
+--------+--------------------------------+
| P001   | CA002,CA004                    | 
| P002   | CA003                          | 
| P003   | CA001,CA003                    | 
| P004   | CA005,CA002                    | 
| P005   | CA001,CA004                    | 
| P006   | CA005,CA001                    | 
| P007   | CA005,CA002                    | 
| P008   | CA005,CA004                    | 
+--------+--------------------------------+
8 rows in set (0.00 sec)
```

#### <font color=#FFE384>处理3：合并字段到一行,且对合并后的字段排序</font>
表`book_mast`结构：
<pre>
+---------+-------------------------------------+-------------+---------+--------+--------+------------+----------+---------+------------+
| book_id | book_name                           | isbn_no     | cate_id | aut_id | pub_id | dt_of_pub  | pub_lang | no_page | book_price |
+---------+-------------------------------------+-------------+---------+--------+--------+------------+----------+---------+------------+
| BK001   | Introduction to Electrodynamics     | 0000979001  | CA001   | AUT001 | P003   | 2001-05-08 | English  |     201 |      85.00 |
| BK002   | Understanding of Steel Construction | 0000979002  | CA002   | AUT002 | P001   | 2003-07-15 | English  |     300 |     105.50 |
| BK003   | Guide to Networking                 | 0000979003  | CA003   | AUT003 | P002   | 2002-09-10 | Hindi    |     510 |     200.00 |
| BK004   | Transfer  of Heat and Mass          | 0000979004  | CA002   | AUT004 | P004   | 2004-02-16 | English  |     600 |     250.00 |
| BK005   | Conceptual Physics                  | 0000979005  | CA001   | AUT005 | P006   | 2003-07-16 | NULL     |     345 |     145.00 |
| BK006   | Fundamentals of Heat                | 0000979006  | CA001   | AUT006 | P005   | 2003-08-10 | German   |     247 |     112.00 |
| BK007   | Advanced 3d Graphics                | 0000979007  | CA003   | AUT007 | P002   | 2004-02-16 | Hindi    |     165 |      56.00 |
| BK008   | Human Anatomy                       | 0000979008  | CA005   | AUT008 | P006   | 2001-05-17 | German   |      88 |      50.50 |
| BK009   | Mental Health Nursing               | 0000979009  | CA005   | AUT009 | P007   | 2004-02-10 | English  |     350 |     145.00 |
| BK010   | Fundamentals of Thermodynamics      | 0000979010  | CA002   | AUT010 | P007   | 2002-10-14 | English  |     400 |     225.00 |
| BK011   | The Experimental Analysis of Cat    | 0000979011  | CA004   | AUT011 | P005   | 2007-06-09 | French   |     225 |      95.00 |
| BK012   | The Nature  of World                | 0000979012  | CA004   | AUT005 | P008   | 2005-12-20 | English  |     350 |      88.00 |
| BK013   | Environment a Sustainable Future    | 0000979013  | CA004   | AUT012 | P001   | 2003-10-27 | German   |     165 |     100.00 |
| BK014   | Concepts in Health                  | 0000979014  | CA005   | AUT013 | P004   | 2001-08-25 | NULL     |     320 |     180.00 |
| BK015   | Anatomy & Physiology                | 0000979015  | CA005   | AUT014 | P008   | 2000-10-10 | Hindi    |     225 |     135.00 |
| BK016   | Networks and Telecommunications     | 00009790_16 | CA003   | AUT015 | P003   | 2002-01-01 | French   |      95 |      45.00 |
+---------+-------------------------------------+-------------+---------+--------+--------+------------+----------+---------+------------+
</pre>

代码：
```sql
SELECT pub_id,GROUP_CONCAT(DISTINCT cate_id)
FROM book_mast
GROUP BY pub_id
ORDER BY GROUP_CONCAT(DISTINCT cate_id) ASC;
```

输出：
```sql
mysql> SELECT pub_id,GROUP_CONCAT(DISTINCT cate_id)
    -> FROM book_mast 
    -> GROUP BY pub_id
    -> ORDER BY GROUP_CONCAT(DISTINCT cate_id) ASC;
+--------+--------------------------------+
| pub_id | GROUP_CONCAT(DISTINCT cate_id) |
+--------+--------------------------------+
| P003   | CA001,CA003                    | 
| P005   | CA001,CA004                    | 
| P001   | CA002,CA004                    | 
| P002   | CA003                          | 
| P006   | CA005,CA001                    | 
| P004   | CA005,CA002                    | 
| P007   | CA005,CA002                    | 
| P008   | CA005,CA004                    | 
+--------+--------------------------------+
8 rows in set (0.00 sec)
```

#### <font color=#FFE384>处理4：合并不同（distinct）字段以特定分隔符（separator）到一行，且排序（order by）</font>
表`book_mast`结构：
<pre>
+---------+-------------------------------------+-------------+---------+--------+--------+------------+----------+---------+------------+
| book_id | book_name                           | isbn_no     | cate_id | aut_id | pub_id | dt_of_pub  | pub_lang | no_page | book_price |
+---------+-------------------------------------+-------------+---------+--------+--------+------------+----------+---------+------------+
| BK001   | Introduction to Electrodynamics     | 0000979001  | CA001   | AUT001 | P003   | 2001-05-08 | English  |     201 |      85.00 |
| BK002   | Understanding of Steel Construction | 0000979002  | CA002   | AUT002 | P001   | 2003-07-15 | English  |     300 |     105.50 |
| BK003   | Guide to Networking                 | 0000979003  | CA003   | AUT003 | P002   | 2002-09-10 | Hindi    |     510 |     200.00 |
| BK004   | Transfer  of Heat and Mass          | 0000979004  | CA002   | AUT004 | P004   | 2004-02-16 | English  |     600 |     250.00 |
| BK005   | Conceptual Physics                  | 0000979005  | CA001   | AUT005 | P006   | 2003-07-16 | NULL     |     345 |     145.00 |
| BK006   | Fundamentals of Heat                | 0000979006  | CA001   | AUT006 | P005   | 2003-08-10 | German   |     247 |     112.00 |
| BK007   | Advanced 3d Graphics                | 0000979007  | CA003   | AUT007 | P002   | 2004-02-16 | Hindi    |     165 |      56.00 |
| BK008   | Human Anatomy                       | 0000979008  | CA005   | AUT008 | P006   | 2001-05-17 | German   |      88 |      50.50 |
| BK009   | Mental Health Nursing               | 0000979009  | CA005   | AUT009 | P007   | 2004-02-10 | English  |     350 |     145.00 |
| BK010   | Fundamentals of Thermodynamics      | 0000979010  | CA002   | AUT010 | P007   | 2002-10-14 | English  |     400 |     225.00 |
| BK011   | The Experimental Analysis of Cat    | 0000979011  | CA004   | AUT011 | P005   | 2007-06-09 | French   |     225 |      95.00 |
| BK012   | The Nature  of World                | 0000979012  | CA004   | AUT005 | P008   | 2005-12-20 | English  |     350 |      88.00 |
| BK013   | Environment a Sustainable Future    | 0000979013  | CA004   | AUT012 | P001   | 2003-10-27 | German   |     165 |     100.00 |
| BK014   | Concepts in Health                  | 0000979014  | CA005   | AUT013 | P004   | 2001-08-25 | NULL     |     320 |     180.00 |
| BK015   | Anatomy & Physiology                | 0000979015  | CA005   | AUT014 | P008   | 2000-10-10 | Hindi    |     225 |     135.00 |
| BK016   | Networks and Telecommunications     | 00009790_16 | CA003   | AUT015 | P003   | 2002-01-01 | French   |      95 |      45.00 |
+---------+-------------------------------------+-------------+---------+--------+--------+------------+----------+---------+------------+
</pre>

代码：
```sql
SELECT pub_id,GROUP_CONCAT(DISTINCT cate_id
ORDER BY cate_id ASC SEPARATOR ' ')
FROM book_mast
GROUP BY pub_id ;
```

输出：
```sql
mysql> SELECT pub_id,GROUP_CONCAT(DISTINCT cate_id
    -> ORDER BY cate_id ASC SEPARATOR ' ')
    -> FROM book_mast
    -> GROUP BY pub_id ;
+--------+--------------------------------------------------------------------+
| pub_id | GROUP_CONCAT(DISTINCT cate_id ORDER BY cate_id ASC SEPARATOR ' ') |
+--------+--------------------------------------------------------------------+
| P001   | CA002 CA004                                                        | 
| P002   | CA003                                                              | 
| P003   | CA001 CA003                                                        | 
| P004   | CA002 CA005                                                        | 
| P005   | CA001 CA004                                                        | 
| P006   | CA001 CA005                                                        | 
| P007   | CA002 CA005                                                        | 
| P008   | CA004 CA005                                                        | 
+--------+--------------------------------------------------------------------+
8 rows in set (0.00 sec)
```

实践
<pre>
1<-3<-1<-1<-2<-3<-1<-1

1->1->3->2->1->1->3->1

SUBSTRING_INDEX(clicks_trend, '->', -1) 1
SUBSTRING_INDEX(clicks_trend, '->', -2) 3->1
SUBSTRING_INDEX(clicks_trend, '->', -3) 1->3->1
SUBSTRING_INDEX(clicks_trend, '->', -4) 1->1->3->1


SUBSTRING_INDEX(clicks_trend, '->', -1) 1
SUBSTRING_INDEX(SUBSTRING_INDEX(clicks_trend, '->', -2), '->', 1) 3
SUBSTRING_INDEX(SUBSTRING_INDEX(clicks_trend, '->', -3), '->', 1) 1
</pre>
```sql
select website,Campaign campaign,ExternalCampaignId campaign_id,clicks_trend clicks_trend,sum_click,StartDate createtime
from 
(
    select website,Campaign,ExternalCampaignId,StartDate,SUBSTRING_INDEX(clicks_trend, '->', -7) as clicks_trend,
    split_sum(replace(SUBSTRING_INDEX(clicks_trend, '->', -4),'->',',')) as sum_click
    from 
    (
        select website,Campaign,ExternalCampaignId,group_concat(Clicks order by ymd SEPARATOR '->') as clicks_trend,
        count(1) as counts, StartDate
        from 
        (
            select website,Campaign,ExternalCampaignId,sum(Clicks) as Clicks,ymd,
            group_concat(distinct StartDate) as StartDate
            from campaign_cost_report
            where 1 = 1 and website='ugamezone'
            group by website,Campaign,ExternalCampaignId,ymd
        ) a 
        group by website,Campaign,ExternalCampaignId,StartDate
        having count(1) >= 4
    ) b 
) c 
where sum_click <= 10  order by createtime desc limit 0, 20
```
```sql
select website,Campaign,ExternalCampaignId,group_concat(Clicks order by ymd SEPARATOR '->') as clicks_trend,
count(1) as counts
from 
(
    select website,Campaign,ExternalCampaignId,sum(Clicks) as Clicks,ymd
    from campaign_cost_report
    where 1 = 1 and website='ugamezone'
    group by website,Campaign,ExternalCampaignId,ymd
) a 
group by website,Campaign,ExternalCampaignId,StartDate
having count(1) >= 2
```

### <font color=#FF7F00>参考连接</font>
[MySQL中group_concat 函数](https://my.oschina.net/u/3683692/blog/3038836)

[MySQL GROUP_CONCAT() function](https://www.w3resource.com/mysql/aggregate-functions-and-grouping/aggregate-functions-and-grouping-group_concat.php)