import mysql from "mysql2"


const connection = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'huti2408',
        database:'blog'
    })
export function connectDB(){
    connection.connect(err=>{
        if(err) throw err
        else{
            console.log("MySql connected")
        }
    })
}

export default connection