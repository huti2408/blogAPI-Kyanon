import connection from "../lib/mysql-connection";



export default class Category{
    title:String;
    slug:String;
    content:String;
    public static async find(){
        let sql = "Select * from category"
        return await  connection.promise().query(sql)
        
    }
    public static async findOnebyId(id: any){
        let sql = `Select * from category where id = ${id}`
        return await  connection.promise().query(sql)
    }
    
    public static async deleteById(id: any){
        let sql = `Delete from category where id = ${id}`
        return await connection.promise().query(sql)
    }
    public static async createCategory({title,slug,content}){       
            // 'INSERT INTO Category (authorId,title,slug,createdAt,content) Values(1,'Training','abc', '2022-2-4','s')'
            let sql = `INSERT INTO Category (title,slug,content) Values
            (?,?,?)`
           return await  connection.promise().query(sql,[title,slug,content])         
    }
    public static async updateCategory({title,slug,content},id){
        let sql = `UPDATE Category SET 
            title = ?, 
            slug=?,
            content = ?
            Where id = ${id} `
        return await connection.promise().query(sql,[title,slug,content])

    }
}