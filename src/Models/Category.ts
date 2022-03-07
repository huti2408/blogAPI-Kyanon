import connection from "../lib/mysql-connection";


export default class Category{
    title:String;
    slug:String;
    content:String;
    public static async find(){
        let sql = "Select * from category"
        return await connection.promise().query(sql)
        
    }
    public static async findOnebyId(id: any){
        let sql = `Select * from category where id = ${id}`
        return await connection.promise().query(sql)
    }
    
    public static deleteById(id: any){
        let sql = `Delete from category where id = ${id}`
        connection.query(sql,(err)=>{
            if(err) throw err
            return "Delete category successfully!"
        })
    }
}