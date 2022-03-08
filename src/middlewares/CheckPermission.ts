import { NextFunction,Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken"
import connection from "../lib/mysql-connection";

interface DecodeType{
    id:number,
    email:string,
    exp:number
}

const TOKEN_VALUE_INDEX = 1
export default async (req:Request, res:Response,next:NextFunction)=>{
    const tokenJWT = req.headers["authorization"]?.split(" ")[TOKEN_VALUE_INDEX] || ""
    try{
        const decode = jwt.decode(tokenJWT) as DecodeType
        const userId = decode.id
        next()
    }
    catch(err){
        console.log(err)
        res.status(StatusCodes.UNAUTHORIZED).json({
            err
        })
    }
}