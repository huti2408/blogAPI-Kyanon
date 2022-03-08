import { NextFunction,Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken"
import apiMessage from "../constants/Message";
import connection from "../lib/mysql-connection";

interface DecodeType{
    id:number,
    email:string,
    exp:number
}

const TOKEN_VALUE_INDEX = 1
export default (action:string)=>{
    return async (req:Request, res:Response,next:NextFunction)=>{
        const tokenJWT = req.headers["authorization"]?.split(" ")[TOKEN_VALUE_INDEX] || ""
        try{
            const decode = jwt.decode(tokenJWT) as DecodeType
            const userId = decode.id
            let sql = `SELECT permission.id,user_permission.note
            FROM permission, user_permission
            WHERE user_permission.user_id = ${userId} AND user_permission.permission_id=permission.id;`
            const result = (await connection.promise().query(sql))[0]
            var canAccess = false
            if(Array.isArray(result))
            {      
                result.map(item=>{
                    switch(item.id){
                        
                        case 1: 
                            if(action.toLowerCase()==="ReadPost".toLowerCase()){
                                canAccess = true;
                            }
                        break;
                        case 2: 
                            if(action.toLowerCase()==="WritePost".toLowerCase()){
                                canAccess = true;
                            }
                        break;
                        case 3: 
                            if(action.toLowerCase()==="ReadCategory".toLowerCase()){
                                canAccess = true;
                            }
                        break;
                        case 4: 
                            if(action.toLowerCase()==="WriteCategory".toLowerCase()){
                                canAccess = true;
                            }
                        break;
                    }
                })
                if(canAccess){
                    next()
                }
                else{
                    res.status(StatusCodes.UNAUTHORIZED).json("You dont have permission to access")
                }
            }
            else{
                res.status(apiMessage.BAD_REQUEST.StatusCodes).json(apiMessage.BAD_REQUEST.message)
            }
           
            
        }
        catch(err){
            console.log(err)
            
        }
    }
}
