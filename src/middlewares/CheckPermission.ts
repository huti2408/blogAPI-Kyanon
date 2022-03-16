import { NextFunction,Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken"
import _ from "lodash";


interface DecodeType{
    id:number,
    email:string,
    permissions:[any]
    exp:number
}

const TOKEN_VALUE_INDEX = 1
export default (resource:string)=>{
    return async (req:Request, res:Response,next:NextFunction)=>{
        const tokenJWT = req.headers["authorization"]?.split(" ")[TOKEN_VALUE_INDEX] || ""
        if(!tokenJWT){
            return res.status(StatusCodes.UNAUTHORIZED).json("Invalid Token")         
        }
        else{
            const decode = jwt.decode(tokenJWT) as DecodeType
            const permissions = decode.permissions
            const action = (req.method).toLowerCase()        
            // if( !result && !permissions[resource].includes(action)){
            //     return res.status(StatusCodes.FORBIDDEN).json("You dont have permission to access")  
            // }
            // else{
            //         next()            
            // }
            return permissions?.[resource]?.includes(action) ? next()
            : res.status(StatusCodes.FORBIDDEN).json("You dont have permission to access")
        }      
    }
}
