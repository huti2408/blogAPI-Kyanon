import connection from "../lib/mysql-connection";

export default class User{
    firstName: String;
    middleName: String;
    lastName: String;
    mobile: String;
    email: String;
    passwordHash: String;
    registeredAt: Date;
    public static async find(){
        let sql = "Select * from user"
        // connection.execute(sql,(err,result)=>{
        //     if(err) throw err
        //     else{
        //         callback(result)
        //     }
        // })
        return await connection.promise().query(sql)
        
    }
    public static async findOnebyId(value: any){
        let sql = `Select * from user where id = ${value}`
        // connection.query(sql,(err,result)=>{
        //     if(err) throw err
        //     callback( result)
        // })
        return await connection.promise().query(sql)
    }
    
    public static deleteById(id: any){
        let sql = `Delete from user where id = ${id}`
        connection.query(sql,(err)=>{
            if(err) throw err
            return "Delete user successfully!"
        })
    }
}