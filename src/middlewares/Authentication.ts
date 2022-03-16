import { NextFunction,Request, Response } from "express";
import jwt from "jsonwebtoken"
import { StatusCodes } from "http-status-codes";
import { GetValue } from "../lib/redis-helper";
import apiMessage from "../constants/Message";

const TOKEN_VALUE_INDEX = 1
interface DecodeType{
    id:number,
    email:string,
    permissions:[]
    exp:number
}

export default async (req: Request, res: Response,next:NextFunction)=>{
    const tokenJWT = req.headers["authorization"]?.split(" ")[TOKEN_VALUE_INDEX] || ""
    try{
        if(!tokenJWT){
            return res.status(apiMessage.INVALID_TOKEN.StatusCodes).json({message:apiMessage.INVALID_TOKEN.message})
        }
        else{
            jwt.verify(tokenJWT, process.env.KEY_JWT || "nothing")
            const decode = jwt.decode(tokenJWT) as DecodeType
            const userId = decode.id
            const tokenRedis = await GetValue(userId)
            if(!tokenRedis)   
            {
                return res.status(apiMessage.INVALID_TOKEN.StatusCodes).json({message:apiMessage.INVALID_TOKEN.message})
            }
            else{
                if(tokenRedis !== tokenJWT){
                    return res.status(apiMessage.INVALID_TOKEN.StatusCodes).json({message:apiMessage.INVALID_TOKEN.message})
                }
                else{
                    next()
                }
            }
        }
    }
    catch(err){
        console.log(err)
        res.status(apiMessage.INVALID_TOKEN.StatusCodes).json({message:apiMessage.INVALID_TOKEN.message})
    }
    
        
    
}