import { NextFunction,Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken"
import apiMessage from "../constants/Message";

interface DecodeType{
    id:number,
    email:string,
    permissions:[any]
    exp:number
}

const TOKEN_VALUE_INDEX = 1
export default (action:string)=>{
    return async (req:Request, res:Response,next:NextFunction)=>{
        const tokenJWT = req.headers["authorization"]?.split(" ")[TOKEN_VALUE_INDEX] || ""
        try{
            if(tokenJWT){
                const decode = jwt.decode(tokenJWT) as DecodeType
                const permissions = decode.permissions
                var canAccess = false
                if(Array.isArray(permissions))
                {      
                    permissions.map(item=>{
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
                        res.status(StatusCodes.FORBIDDEN).json("You dont have permission to access")
                    }
                }
                else{
                    res.status(apiMessage.BAD_REQUEST.StatusCodes).json(apiMessage.BAD_REQUEST.message)
                }
               
            }
            else{
                res.status(StatusCodes.UNAUTHORIZED).json("Invalid Token")
            }
           
            
        }
        catch(err){
            console.log(err)
            res.status(StatusCodes.UNAUTHORIZED).json({error: err.message});
        }
    }
}
