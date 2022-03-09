import { NextFunction,Request, Response } from "express";
import jwt from "jsonwebtoken"
import { StatusCodes } from "http-status-codes";
import { GetValue } from "../lib/redis-helper";

const TOKEN_VALUE_INDEX = 1
interface DecodeType{
    id:number,
    email:string,
    permissions:[]
    exp:number
}

export default async (req:Request,res:Response,next:NextFunction)=>{
    const tokenJWT = req.headers["authorization"]?.split(" ")[TOKEN_VALUE_INDEX] || ""
    try {
        if(tokenJWT){
            const decode = jwt.decode(tokenJWT) as DecodeType
            const userId = decode.id
            const tokenRedis = await GetValue(userId)
            if(tokenRedis)   
            {
                jwt.verify(tokenJWT, process.env.KEY_JWT || "nothing")
                next()
            }
            else{
                res.status(StatusCodes.UNAUTHORIZED).json("Invalid Token")
            }
        }
        else{
            res.status(StatusCodes.UNAUTHORIZED).json("Invalid Token")
        }
        
    }
    catch(err:any){
        console.log(err)
        res.status(StatusCodes.UNAUTHORIZED).json({
            err
        })
    }

}