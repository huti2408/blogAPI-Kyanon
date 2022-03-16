import connection from "../lib/mysql-connection";

export default class Permission{
    userId: number;
    permissionId:number;
    note:string;
    public static async GetAll(){
        let sql = "Select * from user_permission"
        return (await connection.promise().query(sql))[0]
    }
    public static async AssignPermission({userId,permissionId,note}){
        let sql = `INSERT INTO user_permission (user_id,permission_id,note) values (?,?,?)`
        return await connection.promise().query(sql,[userId,permissionId,note])
    }
    public static async DeletePermission({userId,permissionId}){
        let sql = `Delete from user_permission where user_id = ${userId} AND permission_id = ${permissionId}`
        return await connection.promise().query(sql)
    }
    public static async GetUserPermission(userId){
        let sql = `SELECT permission.resource,permission.action
                FROM permission, user_permission
                WHERE user_permission.user_id = ${userId} AND user_permission.permission_id=permission.id;`
        return (await connection.promise().query(sql))[0]
    }
    public static async FindPermission(userId,permissionId){
        let sql = `Select * from user_permission where user_id=${userId} and permission_id = ${permissionId}`
        return (await connection.promise().query(sql))[0][0]
    }
}