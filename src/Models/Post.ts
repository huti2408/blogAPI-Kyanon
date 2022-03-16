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
    
    public static async deleteById(id: any){
        let sql = `Delete from post where id = ${id}`
        return await connection.promise().query(sql)
    }

    public static async CreatePost({authorId,title,slug,content}){
        const dateNow = new Date();
        const createdAt = dateNow.getFullYear()+ '-' + dateNow.getMonth() + '-' + dateNow.getDate()
        let sql = `INSERT INTO post (authorId,title,slug,createdAt,content) Values
            (?,?,?,?,?)`
        return await connection.promise().query(sql,[authorId,title,slug,createdAt,content])

    }
    public static async UpdatePost({title,slug,content,authorId},id){
        
            let sql = `UPDATE post SET 
            title = ?, authorId = ?,slug=?,updatedAt = ?, content = ?
            Where id = ${id} `
            const dateNow = new Date();
            const createdAt = dateNow.getFullYear()+ '-' + dateNow.getMonth() + '-' + dateNow.getDate()
            return await connection.promise().query(sql,[title,authorId,slug,createdAt,content])
    }
    
    
} 