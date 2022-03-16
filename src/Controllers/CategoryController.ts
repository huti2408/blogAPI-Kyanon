import {Request,Response } from "express";
import apiMessage from "../constants/Message";
import connection from "../lib/mysql-connection";
import Category from "../Models/Category";
import client from "../lib/redis-helper"
import { StatusCodes } from "http-status-codes";


export default class CategoryController{
    public static async GetAllCategorys(req: Request, res: Response){
        try{     
            const cates = (await Category.find())[0]
            const data = await client.get("cates")
            if(data === null)
            {
                await client.setEx("cates",360,JSON.stringify(cates))
               return res.status(StatusCodes.OK).json(cates) 
            }
            else{
               return res.status(StatusCodes.OK).json(JSON.parse(data)) 

            } 
        }
        catch(err){
            console.log(err.message);
            res.status(StatusCodes.NOT_FOUND).json({error: err.message});
        }
    }
    public static async GetCategory(req: Request, res: Response){
        try{
            const {id} = req.params;
            const cate = await Category.findOnebyId(id)
            return res.status(StatusCodes.OK).json(cate[0][0])          
        }
        catch(err){
            console.log(err.message);
            res.status(StatusCodes.NOT_FOUND).json({error: err.message});
        }
     
        
    }
    public static async CreateCategory(req: Request, res: Response){
        try{
            const {title,slug,content} = req.body;
            // 'INSERT INTO Category (authorId,title,slug,createdAt,content) Values(1,'Training','abc', '2022-2-4','s')'
            // let sql = `INSERT INTO Category (title,slug,content) Values
            // (?,?,?)`
            // connection.query(sql,[title,slug,content],(err)=>{
            //     if(err) throw err
            //     else res.status(apiMessage.CREATE.StatusCodes).json(apiMessage.CREATE.message)
            // })
            const data:any = await Category.createCategory({title,slug,content})
            
            return res.status(apiMessage.CREATE.StatusCodes).json({message:apiMessage.CREATE.message,CateId:data[0]?.insertId})
        }
        catch(err){
            console.log(err.message);
            return res.status(apiMessage.BAD_REQUEST.StatusCodes).json({error: apiMessage.BAD_REQUEST.message});
        }
    }
    public static async UpdateCategory(req: Request, res: Response){
        try{
            const {id} = req.params;
            const {title,slug,content} = req.body
            // let sql = `UPDATE Category SET 
            // title = ?, 
            // slug=?,
            // content = ?
            // Where id = ${id} `
            // await connection.promise().query(sql,[title,slug,content])
            await Category.updateCategory({title,slug,content},id)
            return res.status(StatusCodes.OK).json(apiMessage.UPDATE)
        
        }
        catch(err){
            console.log(err.message);
            return res.status(apiMessage.BAD_REQUEST.StatusCodes).json({error: apiMessage.BAD_REQUEST.message});
        }
    }
    public static async DeleteCategory(req: Request, res: Response){
        try{
            const {id} = req.params;
             await Category.deleteById(id)
            return res.status(StatusCodes.OK).json(apiMessage.DELETE);
        }
        catch(err){
            console.log(err.message);
            return res.status(apiMessage.BAD_REQUEST.StatusCodes).json({error: apiMessage.BAD_REQUEST.message});
        }
    }
}