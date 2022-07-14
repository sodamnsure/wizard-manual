# Common statements

## 一、查询用户权限

1. 查看所有用户:

   ```sql
   select * from all_users;
   ```

2. 查看用户或角色系统权限(直接赋值给用户或角色的系统权限)：

   ```sql
   select * from dba_sys_privs;
   select * from user_sys_privs;
   ```

   DBA_SYS_PRIVS描述授予用户和角色的系统权限。此视图不显示USERNAME列

3. 查看角色(只能查看登陆用户拥有的角色)所包含的权限

   ```sql
   select * from role_sys_privs;
   ```

   