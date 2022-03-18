import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import apiMessage from "../constants/Message";
import { DeleteValue } from "../lib/redis-helper";
import Permission from "../Models/Permission";

export default class PermissionController {
   public static async GetAllPermissions(req: Request, res: Response) {
      try {
         const pers = await Permission.getAll();
         res.status(StatusCodes.OK).json(pers);
      } catch (err: any) {
         console.log(err.message);
         res.status(apiMessage.BAD_REQUEST.StatusCodes).json(apiMessage.BAD_REQUEST.message);
      }
   }
   public static async AssignPermission(req: Request, res: Response) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }
      const { userId, permissionId, note } = req.body;
      Permission.assignPermission({ userId, permissionId, note })
         .then(() => {
            DeleteValue(userId);
            return res.status(apiMessage.CREATE.StatusCodes).json({ message: "Assign Permission Successfully!" });
         })
         .catch((err) => {
            console.log(err);
            return res.status(apiMessage.SERVER_ERROR.StatusCodes).json({ message: apiMessage.SERVER_ERROR.message });
         });
   }
   public static async DeletePermission(req: Request, res: Response) {
      try {
         const { userId, permissionId } = req.body;
         const permission = await Permission.findPermission(userId, permissionId);
         if (!permission) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "PERMISSION NOT FOUND" });
         } else {
            Permission.deletePermission({ userId, permissionId });
            new Promise((resolve, reject) => {
               if (userId) {
                  resolve(userId);
               } else {
                  reject("User ID not found");
               }
            })
               .then((userId) => {
                  DeleteValue(userId);
               })
               .catch((err) => {
                  console.log(err);
               });
            return res.status(apiMessage.DELETE.StatusCodes).json({ message: apiMessage.DELETE.message });
         }
      } catch (err: any) {
         console.log(err.message);
         res.status(apiMessage.BAD_REQUEST.StatusCodes).json(apiMessage.BAD_REQUEST.message);
      }
   }
}
