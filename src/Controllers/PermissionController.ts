import {Request, Response} from "express";
import { StatusCodes } from "http-status-codes";
import apiMessage from "../constants/Message";
import connection from "../lib/mysql-connection";
import { DeleteValue } from "../lib/redis-helper";

export default class PermissionController {
    public static async GetAllPermissions(req: Request, res: Response){
        try{ 
            let sql = "Select * from user_permission"
            const pers = await connection.promise().query(sql)
            res.status(StatusCodes.OK).json(pers[0])
        }
        catch(err:any){
            console.log(err.message);
            res.status(apiMessage.BAD_REQUEST.StatusCodes).json(apiMessage.BAD_REQUEST.message);
        }
    }
    public static async AssignPermission(req: Request, res: Response){
        try{ 
            const {user_id,permission_id,note} = req.body
            let sql = `INSERT INTO user_permission (user_id,permission_id,note) values (${user_id},${permission_id},'${note}')`
            await connection.promise().query(sql)
            res.status(apiMessage.CREATE.StatusCodes).json("Assign Permission Successfully!")
        }
        catch(err:any){
            console.log(err.message);
            res.status(apiMessage.BAD_REQUEST.StatusCodes).json(apiMessage.BAD_REQUEST.message);
        }
    }
    public static async UpdatePermission(req: Request, res: Response){
        try{ 
            const {user_id,permission_id,note} = req.body
            const {id} = req.params
            let sql = `UPDATE user_permission SET 
            user_id = ${user_id},
            permission_id = ${permission_id},
            note = '${note}' 
            Where id = ${id} `
            await connection.promise().query(sql)
            DeleteValue(user_id)
            res.status(apiMessage.UPDATE.StatusCodes).json(apiMessage.UPDATE.message)
        }
        catch(err:any){
            console.log(err.message);
            res.status(apiMessage.BAD_REQUEST.StatusCodes).json(apiMessage.BAD_REQUEST.message);
        }
    }
    public static async DeletePermission(req: Request, res: Response){
        try{
            const {id} = req.params
            const {user_id} = req.body
            let sql = `Delete from user_permission where id = ${id}`
            DeleteValue(user_id)
            await connection.promise().query(sql)
            res.status(apiMessage.DELETE.StatusCodes).json(apiMessage.DELETE.message)
        }
        catch(err:any){
            console.log(err.message);
            res.status(apiMessage.BAD_REQUEST.StatusCodes).json(apiMessage.BAD_REQUEST.message);
        }
    }
}