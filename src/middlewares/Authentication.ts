import { NextFunction,Request, Response } from "express";
import jwt from "jsonwebtoken"
import { StatusCodes } from "http-status-codes";
import { GetValue } from "../lib/redis-helper";

const TOKEN_VALUE_INDEX = 1
interface DecodeType{
    id:number,
    email:string,
    exp:number
}

export default async (req:Request,res:Response,next:NextFunction)=>{
    const tokenJWT = req.headers["authorization"]?.split(" ")[TOKEN_VALUE_INDEX] || ""
    try {
        const decode = jwt.decode(tokenJWT) as DecodeType
        const userId = decode.id
        const table = await GetValue(userId)
        const checkValid = table.find(token=> token.token_value === tokenJWT).is_valid
        if(checkValid)   
        {
            jwt.verify(tokenJWT, process.env.KEY_JWT || "nothing")
            next()
        }
        else{
            res.status(StatusCodes.OK).json("Invalid Token")
        }
        
    }
    catch(err:any){
        console.log(err)
        res.status(StatusCodes.UNAUTHORIZED).json({
            err
        })
    }

}