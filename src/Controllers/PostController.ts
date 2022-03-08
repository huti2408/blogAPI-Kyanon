import {Request,Response } from "express";
import connection from "../lib/mysql-connection";
import Post from "../Models/Post";
import apiMessage from "../constants/Message";

export default class PostController{
    public static async GetAllPosts(req: Request, res: Response){
        try{
            res.status(200).json((await Post.find())[0]) 
        }
        catch(err){
            console.log(err.message);
            res.status(404).json({error: err.message});
        }
    }
    public static async GetPost(req: Request, res: Response){
        try{
            const {id} = req.params;
            const cate = await Post.findOnebyId(id)
            res.status(200).json(cate[0][0])           
        }
        catch(err){
            console.log(err.message);
            res.status(404).json({error: err.message});
        }
     
        
    }
    public static async CreatePost(req: Request, res: Response){
        try{
            const dateNow = new Date();
            const {authorId,title,slug,content} = req.body;
            // 'INSERT INTO post (authorId,title,slug,createdAt,content) Values(1,'Training','abc', '2022-2-4','s')'
            let sql = `INSERT INTO post (authorId,title,slug,createdAt,content) Values
            (${authorId},'${title}',
            '${slug}',
            '${dateNow.getFullYear()+ '-' + dateNow.getMonth() + '-' + dateNow.getDate()}',
            '${content}')`
            connection.query(sql,(err)=>{
                if(err) throw err
                else res.status(201).json(apiMessage.CREATE)
            })
        }
        catch(err){
            console.log(err.message);
            res.status(400).json({error: err.message});
        }
    }
    public static async UpdatePost(req: Request, res: Response){
        try{
            const {id} = req.params;
            const {title,slug,content,authorId} = req.body
            const dateNow = new Date();
            let sql = `UPDATE post SET 
            title = '${title}', 
            authorId = ${authorId},
            slug='${slug}',
            updatedAt = '${dateNow.getFullYear().toString()+ '-' + dateNow.getMonth() + '-' + dateNow.getDate() +" " +dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds()}',
            content = '${content}'
            Where id = ${id} `
            connection.query(sql,(err)=>{
                if(err) throw err
                else res.status(200).json(apiMessage.UPDATE)
            })
        }
        catch(err){
            console.log(err.message);
            res.status(400).json({error: err.message});
        }
    }
    public static async DeletePost(req: Request, res: Response){
        try{
            const {id} = req.params;
            await Post.deleteById(id)
            res.status(200).json(apiMessage.DELETE);
        }
        catch(err){
            console.log(err.message);
            res.status(400).json({error: err.message});
        }
    }
}