import {Request, Response} from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken"
import md5 from "md5"
import lodash, { nth } from "lodash"
import apiMessage from "../constants/Message";
import connection from "../lib/mysql-connection";
import User from "../Models/User"
import { DeleteValue, SetValue} from "../lib/redis-helper";
import _ from "lodash";

export default class UserController{
    public static async GetAllUsers(req: Request, res: Response){
        try{
            res.status(StatusCodes.OK).json((await User.find())[0])      
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
            let findExisted = `Select * from user Where email = ?`
            var existedUser: any; 
            connection.query(findExisted,email,(err,result)=>{
                existedUser = result
            })
            if(!existedUser){
                let sql = `INSERT INTO User (firstName, middleName,lastName,mobile,email,passwordHash,registeredAt) Values(?,?,?,?,?,?,?)`
                connection.query(sql,
                    [firstName,middleName,lastName,mobile,email,passwordHash,
                        dateNow.getFullYear().toString()+ '-' + dateNow.getMonth() + '-' + dateNow.getDate() +" " +dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds()
                    ],(err)=>{
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
                firstName = ?,
               middleName = ?,
               lastName = ?,
               mobile = ?,
               email = ?,
               passwordHash = ?
            Where id = ${id} `
            connection.query(sql,[firstName,middleName,lastName,mobile,email,passwordHash],(err)=>{
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
             User.deleteById(id)
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
           let findExisted = `Select * from user Where email = ?`
           var existedUser = (await connection.promise().query(findExisted,email))[0][0]
           if(!email || !password){
               res.status(StatusCodes.BAD_REQUEST).json("Bad Request")
           }
           else {
               if(!existedUser || existedUser.passwordHash !== passwordHash){
                   res.status(StatusCodes.OK).json({message:"Email or password is not correct!"})
               }
               else{                 
                const userId = existedUser.id
                const userEmail = existedUser.email;
                var permissionObj={}
                let sql = `SELECT permission.resource,permission.action
                FROM permission, user_permission
                WHERE user_permission.user_id = ${userId} AND user_permission.permission_id=permission.id;`
                const permissions = (await connection.promise().query(sql))[0]

                _.forEach(permissions,(value:any)=>{
                    const resource = value.resource;
                    const action = value.action
                    console.log([action])
                    _.has(permissionObj,resource) ? permissionObj[resource].push(action)
                    :permissionObj[resource] = [action]
                    
                })
                console.log(permissionObj)
                // if(Array.isArray(permissions)){
                //     permissionObj = _.groupBy(permissions,'resource')
                //     var newObj = Object.values(permissionObj).map(rs=>{
                //     if(!Array.isArray(rs)){
                //         return res.status(StatusCodes.UNAUTHORIZED).json("Server error");
                //     }
                //     else{
                //         return rs.map(item=>item.action)
                //     }
                //     })
                //     Object.keys(permissionObj).map((item,index)=>{
                //         permissionObj[item] = newObj[index]
                //     })               
                // }
                // else{
                //     throw new Error
                // }
                const token = jwt.sign({
                    id:userId,email:userEmail,permissions:permissionObj
                },process.env.KEY_JWT || "SADASC")
                setTimeout(()=>{
                    SetValue(userId,token)
                },0)
                res.status(StatusCodes.OK).json({token})
                // new Promise((resolve, reject) => {
                //     if(userId) resolve(userId)
                //     else reject("User ID not found")
                // }).then(userId=>{
                //     SetValue(userId,token)
                // }).catch(err=>{
                //     console.log(err)
                // })
               }
           }
        }
        catch(err){
            console.log(err.message);
            res.status(StatusCodes.UNAUTHORIZED).json({error: err.message});
        }
    }

    public static async LogOut(req: Request, res: Response){
        const {userId} = req.body
        if(!userId){
            return res.status(StatusCodes.UNAUTHORIZED).json("Server error");
        }
        try{
            DeleteValue(userId)
            res.status(StatusCodes.OK).json({message:"Log out Successfully!"})
        }
        catch(err:any){
            console.log(err.message);
            res.status(StatusCodes.UNAUTHORIZED).json("Server error");
        }
    }
}