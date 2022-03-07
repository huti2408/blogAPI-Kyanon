import connection from "../lib/mysql-connection";


export default class Post{
    authorId: Number;
    title:String;
    slug: String;
    published:Boolean;
    createdAt:Date;
    updatedAt:Date;
    content:String

    public  static async find(){
        let sql = "Select * from post"
        return await connection.promise().query(sql)
        
    }
    public static async findOnebyId(value: any){
        let sql = `Select * from post where id = ${value}`
        return await connection.promise().query(sql)
    }
    
    public static deleteById(id: any){
        let sql = `Delete from post where id = ${id}`
        connection.query(sql,(err)=>{
            if(err) throw err
            return "Delete post successfully!"
        })
    }
    
} 