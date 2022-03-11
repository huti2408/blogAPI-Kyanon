import {Request,Response } from "express";
import connection from "../lib/mysql-connection";
import Post from "../Models/Post";
import apiMessage from "../constants/Message";
import { StatusCodes } from "http-status-codes";

export default class PostController{
    public static async GetAllPosts(req: Request, res: Response){
        try{
            res.status(StatusCodes.OK).json((await Post.find())[0]) 
        }
        catch(err){
            console.log(err.message);
            res.status(StatusCodes.NOT_FOUND).json({error: err.message});
        }
    }
    public static async GetPost(req: Request, res: Response){
        try{
            const {id} = req.params;
            const cate = await Post.findOnebyId(id)
            res.status(StatusCodes.OK).json(cate[0][0])           
        }
        catch(err){
            console.log(err.message);
            res.status(StatusCodes.NOT_FOUND).json({error: err.message});
        }
     
        
    }
    public static async CreatePost(req: Request, res: Response){ 
            const dateNow = new Date();
            const {authorId,title,slug,content} = req.body;
            let sql = `INSERT INTO post (authorId,title,slug,createdAt,content) Values
            (?,?,?,?,?)`
            connection.query(sql,[authorId,title,slug,dateNow.getFullYear()+ '-' + dateNow.getMonth() + '-' + dateNow.getDate(),content],(err)=>{
                if(err) {
                    console.log(err)
                    return res.status(apiMessage.SERVER_ERROR.StatusCodes).json({error: apiMessage.SERVER_ERROR.message});
                }
                else res.status(apiMessage.CREATE.StatusCodes).json(apiMessage.CREATE)
            }) 
    }
    public static async UpdatePost(req: Request, res: Response){
        try{
            const {id} = req.params;
            const {title,slug,content,authorId} = req.body
            const dateNow = new Date();
            let sql = `UPDATE post SET 
            title = ?, authorId = ?,slug=?,updatedAt = ?, content = ?
            Where id = ${id} `
            connection.query(sql,[title,authorId,slug,dateNow.getFullYear().toString()+ '-' + dateNow.getMonth() + '-' + dateNow.getDate() +" " +dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds(),content],(err)=>{
                if(err) throw err
                else res.status(StatusCodes.OK).json(apiMessage.UPDATE)
            })
        }
        catch(err){
            console.log(err.message);
            res.status(apiMessage.BAD_REQUEST.StatusCodes).json({error: apiMessage.BAD_REQUEST.message});
        }
    }
    public static async DeletePost(req: Request, res: Response){
        try{
            const {id} = req.params;
            Post.deleteById(id)
            res.status(StatusCodes.OK).json(apiMessage.DELETE);
        }
        catch(err){
            console.log(err.message);
            res.status(apiMessage.BAD_REQUEST.StatusCodes).json({error: apiMessage.BAD_REQUEST.message});
        }
    }
}