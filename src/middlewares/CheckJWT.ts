import { NextFunction,Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken"
import { GetValue } from "../lib/redis-helper";

const TOKEN_VALUE_INDEX = 1
interface DecodeType{
    id:number,
    email:string,
    exp:number
}

export default async (req:Request, res:Response,next:NextFunction)=>{
    const tokenJWT = req.headers["authorization"]?.split(" ")[TOKEN_VALUE_INDEX] || ""
    const decode = jwt.decode(tokenJWT) as DecodeType
    const userId = decode.id
    const table = await GetValue(userId)
    var checkValid = table.find(token=> token.token_value = tokenJWT).is_valid
    console.log(checkValid)
    if(table.includes(tokenJWT) && checkValid)   
    {
        console.log
        next()
    }
    else{
        res.status(StatusCodes.OK).json("Invalid Token")
    }
}