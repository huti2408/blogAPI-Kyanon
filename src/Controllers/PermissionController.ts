import {Request, Response} from "express";
import { StatusCodes } from "http-status-codes";
import apiMessage from "../constants/Message";
import connection from "../lib/mysql-connection";
import { DeleteValue } from "../lib/redis-helper";
import Permission from "../Models/Permission";

export default class PermissionController {
    public static async GetAllPermissions(req: Request, res: Response){
        try{ 
            const pers = await Permission.GetAll()
            res.status(StatusCodes.OK).json(pers)
        }
        catch(err:any){
            console.log(err.message);
            res.status(apiMessage.BAD_REQUEST.StatusCodes).json(apiMessage.BAD_REQUEST.message);
        }
    }
    public static async AssignPermission(req: Request, res: Response){
        try{ 
            const {userId,permissionId,note} = req.body
            Permission.AssignPermission({userId,permissionId,note}).then(()=>{
                DeleteValue(userId)
                return res.status(apiMessage.CREATE.StatusCodes).json({message:"Assign Permission Successfully!"})
            }).catch(err=>{
                console.log(err)
                return res.status(apiMessage.BAD_REQUEST.StatusCodes).json({message :apiMessage.BAD_REQUEST.message});
            })           
        }
        catch(err:any){
            console.log(err.message);
            res.status(apiMessage.BAD_REQUEST.StatusCodes).json(apiMessage.BAD_REQUEST.message);
        }
    }
    // public static async UpdatePermission(req: Request, res: Response){
    //     try{ 
    //         const {userId,permissionId,note} = req.body
    //         let sql = `UPDATE user_permission SET 
    //         user_id = ?,
    //         permission_id = ?,
    //         note = ? 
    //         Where user_id = ${userId} AND permission_id = ${permissionId}`
    //         await connection.promise().query(sql,[userId,permissionId,note])
    //         DeleteValue(userId)
    //         res.status(apiMessage.UPDATE.StatusCodes).json(apiMessage.UPDATE.message)
    //     }
    //     catch(err:any){
    //         console.log(err.message);
    //         res.status(apiMessage.BAD_REQUEST.StatusCodes).json(apiMessage.BAD_REQUEST.message);
    //     }
    // }
    public static async DeletePermission(req: Request, res: Response){
        try{
            const {userId,permissionId} = req.body
            const permission = await Permission.FindPermission(userId,permissionId)
            if(!permission){
                return res.status(StatusCodes.NOT_FOUND).json({message:"PERMISSION NOT FOUND"})
            }
            else{
                Permission.DeletePermission({userId,permissionId})
                new Promise((resolve, reject) => {
                if(userId) {
                    resolve(userId)
                }
                else {
                    reject("User ID not found")
                }
                }).then(userId=>{
                    DeleteValue(userId)
                }).catch(err=>{
                    console.log(err)
                })
                return res.status(apiMessage.DELETE.StatusCodes).json({message:apiMessage.DELETE.message})
            }
            
           
        }
        catch(err:any){
            console.log(err.message);
            res.status(apiMessage.BAD_REQUEST.StatusCodes).json(apiMessage.BAD_REQUEST.message);
        }
    }
}