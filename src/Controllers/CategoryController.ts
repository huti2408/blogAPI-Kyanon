import { Request, Response } from "express";
import apiMessage from "../constants/Message";
import Category from "../Models/Category";
import client from "../lib/redis-helper";
import { StatusCodes } from "http-status-codes";
import { validationResult } from "express-validator";

export default class CategoryController {
   public static async GetAllCategorys(req: Request, res: Response) {
      try {
         const cates = await Category.find();
         const data = await client.get("cates");
         if (data === null) {
            await client.setEx("cates", 360, JSON.stringify(cates));
            return res.status(StatusCodes.OK).json(cates);
         } else {
            return res.status(StatusCodes.OK).json(JSON.parse(data));
         }
      } catch (err) {
         console.log(err.message);
         res.status(StatusCodes.NOT_FOUND).json({ error: err.message });
      }
   }
   public static async GetCategory(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const cate = await Category.findOnebyId(id);
         return res.status(StatusCodes.OK).json(cate);
      } catch (err) {
         console.log(err.message);
         res.status(StatusCodes.NOT_FOUND).json({ error: err.message });
      }
   }
   public static async CreateCategory(req: Request, res: Response) {
      try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
         }
         const { title, slug, content } = req.body;

         const data: any = await Category.createCategory({ title, slug, content });

         return res.status(apiMessage.CREATE.StatusCodes).json({ message: apiMessage.CREATE.message, CateId: data[0]?.insertId });
      } catch (err) {
         console.log(err.message);
         return res.status(apiMessage.BAD_REQUEST.StatusCodes).json({ error: apiMessage.BAD_REQUEST.message });
      }
   }
   public static async UpdateCategory(req: Request, res: Response) {
      try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
         }
         const { id } = req.params;
         const { title, slug, content } = req.body;
         await Category.updateCategory({ title, slug, content }, id);
         return res.status(StatusCodes.OK).json(apiMessage.UPDATE);
      } catch (err) {
         console.log(err.message);
         return res.status(apiMessage.BAD_REQUEST.StatusCodes).json({ error: apiMessage.BAD_REQUEST.message });
      }
   }
   public static async DeleteCategory(req: Request, res: Response) {
      try {
         const { id } = req.params;
         await Category.deleteById(id);
         return res.status(StatusCodes.OK).json(apiMessage.DELETE);
      } catch (err) {
         console.log(err.message);
         return res.status(apiMessage.BAD_REQUEST.StatusCodes).json({ error: apiMessage.BAD_REQUEST.message });
      }
   }
}
