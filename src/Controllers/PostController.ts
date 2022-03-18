import { Request, Response } from "express";
import Post from "../Models/Post";
import apiMessage from "../constants/Message";
import { StatusCodes } from "http-status-codes";
import { validationResult } from "express-validator";

export default class PostController {
   public static async GetAllPosts(req: Request, res: Response) {
      try {
         const posts = await Post.find();
         res.status(StatusCodes.OK).json(posts);
      } catch (err) {
         console.log(err.message);
         res.status(StatusCodes.NOT_FOUND).json({ error: err.message });
      }
   }
   public static async GetPost(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const post = await Post.findOnebyId(id);
         res.status(StatusCodes.OK).json(post);
      } catch (err) {
         console.log(err.message);
         res.status(StatusCodes.NOT_FOUND).json({ error: err.message });
      }
   }
   public static async CreatePost(req: Request, res: Response) {
      try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
         }
         const { authorId, title, slug, content } = req.body;
         const data: any = await Post.createPost({ authorId, title, slug, content });
         return res.status(apiMessage.CREATE.StatusCodes).json({ message: apiMessage.CREATE, PostId: data[0]?.insertId });
      } catch (err) {
         console.log(err.message);
         res.status(apiMessage.BAD_REQUEST.StatusCodes).json({ error: apiMessage.BAD_REQUEST.message });
      }
   }
   public static async UpdatePost(req: Request, res: Response) {
      try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
         }
         const { id } = req.params;
         const { title, slug, content, authorId } = req.body;
         await Post.updatePost({ title, slug, content, authorId }, id);
         return res.status(StatusCodes.OK).json({ message: apiMessage.UPDATE.message });
      } catch (err) {
         console.log(err.message);
         res.status(apiMessage.BAD_REQUEST.StatusCodes).json({ error: apiMessage.BAD_REQUEST.message });
      }
   }
   public static async DeletePost(req: Request, res: Response) {
      try {
         const { id } = req.params;
         await Post.deleteById(id);
         res.status(StatusCodes.OK).json(apiMessage.DELETE);
      } catch (err) {
         console.log(err.message);
         res.status(apiMessage.BAD_REQUEST.StatusCodes).json({ error: apiMessage.BAD_REQUEST.message });
      }
   }
}
