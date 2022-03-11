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
            const {userId,permissionId,note} = req.body
            let sql = `INSERT INTO user_permission (user_id,permission_id,note) values (?,?,?)`
            await connection.promise().query(sql,[userId,permissionId,note])
            res.status(apiMessage.CREATE.StatusCodes).json("Assign Permission Successfully!")
            new Promise((resolve, reject) => {
                if(userId) resolve(userId)
                    else reject("User ID not found")
            }).then(userId=>{
                DeleteValue(userId)
            }).catch(err=>{
                console.log(err)
            })
        }
        catch(err:any){
            console.log(err.message);
            res.status(apiMessage.BAD_REQUEST.StatusCodes).json(apiMessage.BAD_REQUEST.message);
        }
    }
    public static async UpdatePermission(req: Request, res: Response){
        try{ 
            const {userId,permissionId,note} = req.body
            let sql = `UPDATE user_permission SET 
            user_id = ?,
            permission_id = ?,
            note = ? 
            Where user_id = ${userId} AND permission_id = ${permissionId}`
            await connection.promise().query(sql,[userId,permissionId,note])
            DeleteValue(userId)
            res.status(apiMessage.UPDATE.StatusCodes).json(apiMessage.UPDATE.message)
        }
        catch(err:any){
            console.log(err.message);
            res.status(apiMessage.BAD_REQUEST.StatusCodes).json(apiMessage.BAD_REQUEST.message);
        }
    }
    public static async DeletePermission(req: Request, res: Response){
        try{
            const {userId,permissionId} = req.body
            let sql = `Delete from user_permission where user_id = ${userId} AND permission_id = ${permissionId}`
            DeleteValue(userId)
            await connection.promise().query(sql)
            res.status(apiMessage.DELETE.StatusCodes).json(apiMessage.DELETE.message)
        }
        catch(err:any){
            console.log(err.message);
            res.status(apiMessage.BAD_REQUEST.StatusCodes).json(apiMessage.BAD_REQUEST.message);
        }
    }
}