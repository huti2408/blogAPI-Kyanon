import connection from "../lib/mysql-connection";

const DATA_INEX = 0;

export default class User {
  firstName: String;
  middleName: String;
  lastName: String;
  mobile: String;
  email: String;
  passwordHash: String;
  registeredAt: Date;
  public static async find() {
    let sql = "Select * from user";
    return (await connection.promise().query(sql))[DATA_INEX];
  }
  public static async findOnebyId(value: any) {
    let sql = `Select * from user where id = ${value}`;
    return (await connection.promise().query(sql))[DATA_INEX][DATA_INEX];
  }

  public static async deleteById(id: any) {
    let sql = `Delete from user where id = ${id}`;
    return await connection.promise().query(sql);
  }
  public static async register({ firstName, middleName, lastName, mobile, email, passwordHash }) {
    const dateNow = new Date();
    const registeredAt = dateNow.getFullYear().toString() + "-" + dateNow.getMonth() + "-" + dateNow.getDate() + " " + dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds();
    let sql = `INSERT INTO User (firstName, middleName,lastName,mobile,email,passwordHash,registeredAt) Values(?,?,?,?,?,?,?)`;
    return await connection.promise().query(sql, [firstName, middleName, lastName, mobile, email, passwordHash, registeredAt]);
  }
  public static async updateUser({ firstName, middleName, lastName, mobile, email, passwordHash }, id) {
    let sql = `UPDATE User SET 
                firstName = ?,
               middleName = ?,
               lastName = ?,
               mobile = ?,
               email = ?,
               passwordHash = ?
            Where id = ${id} `;
    return connection.promise().query(sql, [firstName, middleName, lastName, mobile, email, passwordHash]);
  }
  public static async findByEmail(email) {
    let findExisted = `Select * from user Where email = ?`;
    return (await connection.promise().query(findExisted, email))[DATA_INEX][DATA_INEX];
  }
}
