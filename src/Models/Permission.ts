import connection from "../lib/mysql-connection";
const DATA_INEX = 0;

export default class Permission {
   userId: number;
   permissionId: number;
   note: string;
   public static async getAll() {
      let sql = "Select * from user_permission";
      return (await connection.promise().query(sql))[DATA_INEX];
   }
   public static async assignPermission({ userId, permissionId, note }) {
      let sql = `INSERT INTO user_permission (user_id,permission_id,note) values (?,?,?)`;
      return await connection.promise().query(sql, [userId, permissionId, note]);
   }
   public static async deletePermission({ userId, permissionId }) {
      let sql = `Delete from user_permission where user_id = ? AND permission_id = ?`;
      return await connection.promise().query(sql, [userId, permissionId]);
   }
   public static async getUserPermission(userId) {
      let sql = `SELECT permission.resource,permission.action
                FROM permission, user_permission
                WHERE user_permission.user_id = ? AND user_permission.permission_id=permission.id;`;
      return (await connection.promise().query(sql, [userId]))[DATA_INEX];
   }
   public static async findPermission(userId, permissionId) {
      let sql = `Select * from user_permission where user_id=? and permission_id = ?`;
      return (await connection.promise().query(sql, [userId, permissionId]))[DATA_INEX][DATA_INEX];
   }
}
