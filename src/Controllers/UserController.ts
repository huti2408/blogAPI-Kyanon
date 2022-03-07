import {Request, Response} from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken"
import md5 from "md5"
import apiMessage from "../constants/Message";
import connection from "../lib/mysql-connection";
import User from "../Models/User"

export default class UserController{
    public static async GetAllUsers(req: Request, res: Response){
        try{
            res.status(200).json((await User.find())[0])      
        }
        catch(err){
            console.log(err.message);
            res.status(StatusCodes.NOT_FOUND).json({error: err.message});
        }
    }
    public static async GetUser(req: Request, res: Response){
        try{
            const {id} = req.params;
            const cate = await User.findOnebyId(id)
            res.status(200).json(cate[0][0])          
        }
        catch(err){
            console.log(err.message);
            res.status(StatusCodes.NOT_FOUND).json({error: err.message});
        }
     
        
    }
    public static async Register(req: Request, res: Response){
        try{
            const dateNow = new Date();
            const {firstName, middleName,lastName,mobile,email,password} = req.body;
            var passwordHash = md5(password);
            let findExisted = `Select * from user Where email = ${email}`
            var existedUser: any; 
            await connection.query(findExisted,(err,result)=>{
                existedUser = result
            })
            if(!existedUser){
                let sql = `INSERT INTO User (firstName, middleName,lastName,mobile,email,passwordHash,registeredAt) Values
                ('${firstName}',
                '${middleName}',
                '${lastName}',
                '${mobile}',
                '${email}',
                '${passwordHash}',
                '${dateNow.getFullYear().toString()+ '-' + dateNow.getMonth() + '-' + dateNow.getDate() +" " +dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds()}')`
                await connection.query(sql,(err)=>{
                    if(err) throw err
                    else res.status(StatusCodes.CREATED).json("Register successfully!")
                })
            }
            else{
                return res.json("Email isn't available!")
            }
            
        }
        catch(err){
            console.log(err.message);
            res.status(StatusCodes.BAD_REQUEST).json({error: err.message});
        }
    }
    public static async UpdateUser(req: Request, res: Response){
        try{
            const {id} = req.params;
            const {firstName, middleName,lastName,mobile,email,password} = req.body
            var passwordHash = md5(password);
            let sql = `UPDATE User SET 
                firstName = '${firstName}',
               middleName = '${middleName}',
               lastName = '${lastName}',
               mobile = '${mobile}',
               email = '${email}',
               passwordHash = '${passwordHash}'
            Where id = ${id} `
            connection.query(sql,(err)=>{
                if(err) throw err
                else res.status(StatusCodes.OK).json(apiMessage.UPDATE)
            })
        }
        catch(err){
            console.log(err.message);
            res.status(StatusCodes.BAD_REQUEST).json({error: err.message});
        }
    }
    public static async DeleteUser(req: Request, res: Response){
        try{
            const {id} = req.params;
            await User.deleteById(id)
            res.status(StatusCodes.OK).json(apiMessage.DELETE);
        }
        catch(err){
            console.log(err.message);
            res.status(StatusCodes.BAD_REQUEST).json({error: err.message});
        }
    }
    public static async Login(req: Request, res: Response){
        try{
           const {email, password} = req.body
           const passwordHash = md5(password)
           if(!email || !password){
               res.status(StatusCodes.BAD_REQUEST).json("Bad Request")
           }
           else {
               const users = await User.find()[0]
               const user = users.find(user=> user.email === email)
           }
        }
        catch(err){
            console.log(err.message);
            res.status(StatusCodes.UNAUTHORIZED).json({error: err.message});
        }
    }
}